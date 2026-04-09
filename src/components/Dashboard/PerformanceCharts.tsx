import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SOPLog, sopService } from '@/services/sopService';

interface PerformanceChartsProps {
  logs: SOPLog[];
  comparisonData: { name: string; avgScore: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c1425] border border-white/10 p-3 rounded shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name.includes('Rate') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ logs, comparisonData }) => {
  const chartData = sopService.mapLogsToChart(logs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Efficiency Trend */}
      <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Efficiency Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                name="Efficiency"
                stroke="#84ce3a" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#84ce3a', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Score Trend */}
      <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Performance Score Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                name="Score"
                stroke="#38bdf8" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Rate Trend */}
      <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Error Rate Trend (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="error_rate" 
                name="Error Rate"
                stroke="#f87171" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SOP Comparison */}
      <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Project Comparison (Avg Score)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgScore" 
                name="Avg Score"
                fill="#84ce3a" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
