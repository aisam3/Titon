import { supabase } from '@/lib/supabase';

export interface UserSubscription {
  plan: 'free' | 'pro';
  sop_limit: number;
  log_limit: number;
  subscription_status: 'active' | 'inactive';
}

export interface UsageStats {
  sop_count: number;
  log_count: number;
  sop_limit: number;
  log_limit: number;
}

export const subscriptionService = {
  /**
   * Fetch the current user's plan and limits.
   * Defaults to Free plan if no profile is found.
   */
  async getUserPlan(): Promise<UserSubscription> {
    const { data: { user } } = await supabase.auth.getUser();
    const defaultFree: UserSubscription = { 
      plan: 'free', 
      sop_limit: 3, 
      log_limit: 3, 
      subscription_status: 'active' 
    };

    if (!user) return defaultFree;

    const { data, error } = await supabase
      .from('profiles')
      .select('plan, subscription_tier, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
       return defaultFree;
    }

    // NEW LOGIC: Use tier column if available, otherwise fallback to plan
    const isPro = data.subscription_tier === 'pro' || data.plan === 'pro';

    return {
      plan: isPro ? 'pro' : 'free',
      sop_limit: isPro ? 500 : 3,
      log_limit: isPro ? 500 : 3,
      subscription_status: data.subscription_status || 'active'
    };
  },

  /**
   * Get current usage stats for the user.
   */
  async getUsageStats(): Promise<UsageStats | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const plan = await this.getUserPlan();

    // Count SOPs
    const { count: sopCount, error: sopError } = await supabase
      .from('sops')
      .select('*', { count: 'exact', head: true });

    if (sopError) {
      console.error('Error counting SOPs:', sopError.message);
      throw new Error("Unable to verify SOP count. Please try again.");
    }

    // Count Logs
    const { count: logCount, error: logError } = await supabase
      .from('sop_logs')
      .select('*', { count: 'exact', head: true });

    if (logError) {
      console.error('Error counting logs:', logError.message);
      throw new Error("Unable to verify log count. Please try again.");
    }

    return {
      sop_count: sopCount || 0,
      log_count: logCount || 0,
      sop_limit: plan.sop_limit,
      log_limit: plan.log_limit
    };
  },

  /**
   * Simulate a plan upgrade (Manually set to Pro).
   */
  async upgradeToPro(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        subscription_tier: 'pro',
        plan: 'pro',
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error upgrading plan:', error.message);
      return false;
    }

    return true;
  },

  /**
   * Explicitly activate the free plan for a user.
   */
  async activateFreePlan(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        plan: 'free',
        sop_limit: 3,
        log_limit: 3,
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error activating free plan:', error.message);
      return false;
    }

    return true;
  }
};
