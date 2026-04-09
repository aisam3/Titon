import { supabase } from '@/lib/supabase';

export interface SOP {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface SOPLog {
  id: string;
  sop_id: string;
  user_id: string;
  time_taken: number;
  output: number;
  errors: number;
  efficiency: number;
  error_rate: number;
  score: number;
  created_at: string;
}

export interface PerformancePattern {
  best_entry: SOPLog | null;
  worst_entry: SOPLog | null;
  consistency_status: 'consistent' | 'unstable' | 'stable';
}

export interface MetricsSummary {
  avg_efficiency: number;
  avg_error_rate: number;
  avg_score: number;
  best_score: number;
  worst_score: number;
  last_3_change: number | null;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SOPComparison {
  sop_id: string;
  name: string;
  avg_efficiency: number;
  avg_error_rate: number;
  avg_score: number;
}

export interface RankingData {
  best_sop: SOPComparison | null;
  worst_sop: SOPComparison | null;
  most_improved_sop: SOPComparison | null;
}

export interface SystemAlert {
  type: "warning" | "info" | "critical";
  message: string;
}

export interface SOPDetails {
  sop: SOP;
  logs: SOPLog[];
  metrics_summary: MetricsSummary;
  insights: string[];
  alerts: SystemAlert[];
  pattern: PerformancePattern;
}

/**
 * Service to handle SOP performance tracking logic.
 */
export const sopService = {
  /**
   * Insert a new SOP log and perform calculations via Supabase RPC (Option A).
   */
  async insertLog(sopId: string, timeTaken: number, output: number, errors: number) {
    const { data, error } = await supabase.rpc('insert_sop_log', {
      p_sop_id: sopId,
      p_time_taken: timeTaken,
      p_output: output,
      p_errors: errors,
    });

    if (error) {
      console.error('Error in log insertion:', error.message);
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Fetch all logs for a specific SOP and calculate trends.
   */
  async getSOPLogs(sopId: string) {
    const { data: logs, error } = await supabase
      .from('sop_logs')
      .select('*')
      .eq('sop_id', sopId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching logs:', error.message);
      throw error;
    }

    return logs as SOPLog[];
  },

  /**
   * Calculate summary metrics and trends for a given list of logs.
   */
  calculateMetrics(logs: SOPLog[]): MetricsSummary {
    if (logs.length === 0) {
      return { 
        avg_efficiency: 0, 
        avg_error_rate: 0,
        avg_score: 0,
        best_score: 0,
        worst_score: 0,
        last_3_change: null, 
        trend: 'stable' 
      };
    }

    // Averages
    const avg_efficiency = logs.reduce((sum, log) => sum + log.efficiency, 0) / logs.length;
    const avg_error_rate = logs.reduce((sum, log) => sum + log.error_rate, 0) / logs.length;
    const avg_score = logs.reduce((sum, log) => sum + (log.score * 100), 0) / logs.length;

    // Min/Max
    const best_score = Math.max(...logs.map(l => l.score * 100));
    const worst_score = Math.min(...logs.map(l => l.score * 100));

    // Trend Logic: Comparison of last 3 logs vs previous 3 logs
    let last_3_change: number | null = null;
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';

    if (logs.length >= 4) {
      const last3 = logs.slice(-3);
      const prev3 = logs.slice(-6, -3);

      const last3Avg = last3.reduce((sum, l) => sum + l.efficiency, 0) / last3.length;
      const prev3Avg = prev3.reduce((sum, l) => sum + l.efficiency, 0) / prev3.length;

      if (prev3Avg > 0) {
        last_3_change = ((last3Avg - prev3Avg) / prev3Avg) * 100;
        if (last_3_change > 2) trend = 'increasing';
        else if (last_3_change < -2) trend = 'decreasing';
      }
    } else if (logs.length >= 2) {
      // Fallback for smaller datasets
      const current = logs[logs.length - 1].efficiency;
      const prev = logs[logs.length - 2].efficiency;
      if (prev > 0) {
        last_3_change = ((current - prev) / prev) * 100;
        if (last_3_change > 1) trend = 'increasing';
        else if (last_3_change < -1) trend = 'decreasing';
      }
    }

    return { 
      avg_efficiency, 
      avg_error_rate,
      avg_score,
      best_score,
      worst_score,
      last_3_change, 
      trend 
    };
  },

  /**
   * Generate rule-based insights from performance data.
   */
  generateInsights(logs: SOPLog[], summary: MetricsSummary): string[] {
    const insights: string[] = [];
    if (logs.length < 2) {
      insights.push("Insufficient data to generate trends. Log more performance entries.");
      return insights;
    }

    const { last_3_change, trend } = summary;

    // Insight: Efficiency Change
    if (last_3_change !== null) {
      const action = last_3_change >= 0 ? "getting better" : "getting worse";
      insights.push(`Efficiency is ${action} based on recent entries.`);
    }

    // Insight: Trend Tracking
    if (trend === 'increasing') {
      insights.push("This project is doing great. Keep it up!");
    } else if (trend === 'decreasing') {
      insights.push("Performance dropped lately. Check what happened.");
    }

    // Insight: Error Rate Rising Check
    const lastLogs = logs.slice(-3);
    if (lastLogs.length >= 2) {
      const currentErrorRate = lastLogs[lastLogs.length - 1].error_rate;
      const prevErrorRate = lastLogs[0].error_rate;
      if (currentErrorRate > prevErrorRate && currentErrorRate > 0.05) {
        insights.push("Error rate is going up — double-check your work.");
      } else if (currentErrorRate < prevErrorRate && currentErrorRate < 0.02) {
        insights.push("Very few errors. Great quality!");
      }
    }

    // Insight: General Score Performance
    const lastLog = logs[logs.length - 1];
    if (lastLog.score < 0.5) {
      insights.push("Low score lately. Try to work faster or better.");
    } else if (lastLog.score > 0.9) {
       insights.push("Perfect performance reached. Ready for automation!");
    }

    // New Insight: Best Performance
    const sortedByScore = [...logs].sort((a, b) => b.score - a.score);
    if (sortedByScore.length > 0) {
      const bestEver = sortedByScore[0];
      const dateStr = new Date(bestEver.created_at).toLocaleDateString();
      insights.push(`Best result recorded on ${dateStr}. Try to match that pace!`);
    }

    // New Insight: Efficiency Improvement Over Last 5
    if (logs.length >= 5) {
      const last5 = logs.slice(-5);
      const startEff = last5[0].efficiency;
      const endEff = last5[last5.length - 1].efficiency;
      if (endEff > startEff * 1.05) {
        insights.push("Efficiency improved over last 5 entries. Great work!");
      }
    }

    return insights;
  },

  /**
   * Generate rule-based alerts based on performance thresholds.
   */
  generateAlerts(logs: SOPLog[], summary: MetricsSummary): SystemAlert[] {
    const alerts: SystemAlert[] = [];
    if (logs.length === 0) return alerts;

    const { last_3_change, trend } = summary;
    const last3 = logs.slice(-3);
    const prev3 = logs.slice(-6, -3);

    // Rule A: Performance Drop (Comparing last 3 vs previous 3)
    if (last3.length >= 1 && prev3.length >= 1) {
      const last3Score = last3.reduce((sum, l) => sum + l.score, 0) / last3.length;
      const prev3Score = prev3.reduce((sum, l) => sum + l.score, 0) / prev3.length;
      if (last3Score < prev3Score * 0.9) {
        alerts.push({ type: "critical", message: "Scores dropped a lot compared to before." });
      }
    }

    // Rule B: High Error Rate
    const avgError = logs.reduce((sum, l) => sum + l.error_rate, 0) / logs.length;
    if (avgError > 0.3) {
      alerts.push({ type: "warning", message: "Too many errors found (over 30%)." });
    }

    // Rule C: No Improvement
    if (logs.length >= 5) {
      const last5 = logs.slice(-5);
      const scoreDiff = Math.abs(last5[last5.length - 1].score - last5[0].score);
      if (scoreDiff < 0.05) {
        alerts.push({ type: "info", message: "No progress in last 5 entries." });
      }
    }

    // Rule D: Decreasing Efficiency
    if (trend === 'decreasing') {
      alerts.push({ type: "warning", message: "Efficiency is going down." });
    }

    // Quality check
    if (last3.length > 0 && last3[last3.length - 1].error_rate > 0.15) {
      alerts.push({ type: "warning", message: "Last entry has many errors." });
    }

    return alerts;
  },

  /**
   * Comprehensive logic to fetch all SOPs and generate system-level intelligence.
   */
  async getSystemIntelligence(): Promise<{
    comparisons: SOPComparison[];
    ranking: RankingData;
  }> {
    const { data: sops, error: sopsError } = await supabase
      .from('sops')
      .select('*');

    if (sopsError) throw sopsError;

    const comparisons: SOPComparison[] = await Promise.all(sops.map(async (sop) => {
      const { data: logs } = await supabase
        .from('sop_logs')
        .select('*')
        .eq('sop_id', sop.id)
        .order('created_at', { ascending: true });

      const logsArr = (logs || []) as SOPLog[];
      const avg_efficiency = logsArr.length > 0 ? logsArr.reduce((sum, l) => sum + l.efficiency, 0) / logsArr.length : 0;
      const avg_error_rate = logsArr.length > 0 ? logsArr.reduce((sum, l) => sum + l.error_rate, 0) / logsArr.length : 0;
      const avg_score = logsArr.length > 0 ? logsArr.reduce((sum, l) => sum + l.score, 0) / logsArr.length : 0;

      return {
        sop_id: sop.id,
        name: sop.name,
        avg_efficiency: parseFloat(avg_efficiency.toFixed(2)),
        avg_error_rate: parseFloat(avg_error_rate.toFixed(2)),
        avg_score: parseFloat((avg_score * 100).toFixed(2))
      };
    }));

    // Sorting by score (highest to lowest)
    comparisons.sort((a, b) => b.avg_score - a.avg_score);

    // Ranking Logic
    let most_improved_sop: SOPComparison | null = null;
    let max_improvement = -Infinity;

    for (const sopComp of comparisons) {
      const { data: logs } = await supabase
        .from('sop_logs')
        .select('*')
        .eq('sop_id', sopComp.sop_id)
        .order('created_at', { ascending: true });

      const logsArr = (logs || []) as SOPLog[];
      if (logsArr.length >= 4) {
        const last3 = logsArr.slice(-3);
        const prev3 = logsArr.slice(-6, -3);
        const last3Avg = last3.reduce((sum, l) => sum + l.score, 0) / last3.length;
        const prev3Avg = prev3.reduce((sum, l) => sum + l.score, 0) / prev3.length;
        
        const improvement = last3Avg - prev3Avg;
        if (improvement > max_improvement) {
          max_improvement = improvement;
          most_improved_sop = sopComp;
        }
      }
    }

    return {
      comparisons,
      ranking: {
        best_sop: comparisons.length > 0 ? comparisons[0] : null,
        worst_sop: comparisons.length > 0 ? comparisons[comparisons.length - 1] : null,
        most_improved_sop: most_improved_sop
      }
    };
  },

  /**
   * Reusable function to map logs to chart data
   */
  mapLogsToChart(logs: SOPLog[]) {
    return logs.map(log => ({
      date: new Date(log.created_at).toLocaleDateString(),
      timestamp: new Date(log.created_at).getTime(),
      efficiency: parseFloat(log.efficiency.toFixed(2)),
      error_rate: parseFloat((log.error_rate * 100).toFixed(2)),
      score: parseFloat((log.score * 100).toFixed(2)),
    }));
  },

  /**
   * Replaced by getSystemIntelligence but kept for compatibility if needed.
   */
  async getSOPComparisonData() {
    const intel = await this.getSystemIntelligence();
    return intel.comparisons.map(c => ({ name: c.name, avgScore: c.avg_score }));
  },

  /**
   * Specialized function to detect performance patterns and consistency.
   */
  analyzePerformancePattern(logs: SOPLog[]): PerformancePattern {
    if (logs.length === 0) {
      return { best_entry: null, worst_entry: null, consistency_status: 'stable' };
    }

    const sortedByScore = [...logs].sort((a, b) => b.score - a.score);
    const best_entry = sortedByScore[0];
    const worst_entry = sortedByScore[sortedByScore.length - 1];

    // Consistency check using standard deviation of scores
    let consistency_status: 'consistent' | 'unstable' | 'stable' = 'stable';
    if (logs.length >= 3) {
      const avgScore = logs.reduce((sum, l) => sum + l.score, 0) / logs.length;
      const variance = logs.reduce((sum, l) => sum + Math.pow(l.score - avgScore, 2), 0) / logs.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev < 0.08) consistency_status = 'consistent';
      else if (stdDev > 0.18) consistency_status = 'unstable';
    }

    return { best_entry, worst_entry, consistency_status };
  },

  /**
   * Comprehensive data fetch for a specific SOP.
   */
  async getSOPDetails(sopId: string): Promise<SOPDetails> {
    const { data: sop, error: sopError } = await supabase
      .from('sops')
      .select('*')
      .eq('id', sopId)
      .single();

    if (sopError) {
      throw new Error(`Failed to fetch SOP details: ${sopError.message}`);
    }

    const logs = await this.getSOPLogs(sopId);
    const metrics_summary = this.calculateMetrics(logs);
    const insights = this.generateInsights(logs, metrics_summary);
    const alerts = this.generateAlerts(logs, metrics_summary);
    const pattern = this.analyzePerformancePattern(logs);

    return {
      sop: sop as SOP,
      logs,
      metrics_summary,
      insights,
      alerts,
      pattern
    };
  },

  /**
   * Create a new SOP.
   */
  async createSOP(name: string, description?: string) {
    const { data, error } = await supabase
      .from('sops')
      .insert({ name, description, user_id: (await supabase.auth.getUser()).data.user?.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a specific SOP log.
   */
  async deleteLog(logId: string) {
    const { error } = await supabase
      .from('sop_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
    return true;
  },

  /**
   * Delete a project (SOP).
   */
  async deleteSOP(sopId: string) {
    const { error } = await supabase
      .from('sops')
      .delete()
      .eq('id', sopId);

    if (error) throw error;
    return true;
  }
};

