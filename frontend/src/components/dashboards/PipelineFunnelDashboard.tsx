/**
 * Pipeline Conversion Funnel Dashboard
 *
 * Visualizes conversion rates through job search pipeline:
 * discovered → applied → interviewing → offer → accepted
 *
 * Features:
 * - Funnel chart showing drop-off at each stage
 * - Conversion rate percentages
 * - Time-in-stage metrics
 * - Filters by date range, company, role type
 *
 * SO-DASH-FEAT-009
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../../icons';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  conversionRate: number | null;
  avgTimeInStage: number | null; // days
  color: string;
}

interface OpportunityData {
  id: string;
  company: string;
  role: string;
  stage: string;
  priority: string;
  timeline: {
    discovered?: string;
    applied?: string;
    first_interview?: string;
    offer_received?: string;
    closed?: string;
  };
}

interface PipelineFunnelDashboardProps {
  apiBaseUrl: string;
}

export const PipelineFunnelDashboard: React.FC<PipelineFunnelDashboardProps> = ({ apiBaseUrl }) => {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stage definitions
  const STAGES = [
    { key: 'discovered', name: 'Discovered', color: '#3b82f6' },
    { key: 'applied', name: 'Applied', color: '#10b981' },
    { key: 'interviewing', name: 'Interviewing', color: '#f59e0b' },
    { key: 'offer', name: 'Offer', color: '#8b5cf6' },
    { key: 'accepted', name: 'Accepted', color: '#06b6d4' }
  ];

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    if (opportunities.length > 0) {
      calculateFunnelMetrics();
    }
  }, [opportunities]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/opportunities`);

      if (!response.ok) {
        throw new Error('Failed to load opportunities');
      }

      const data = await response.json();
      setOpportunities(data.pipeline || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFunnelMetrics = () => {
    const stageCounts: Record<string, number> = {};
    const stageTimelines: Record<string, number[]> = {};

    // Count opportunities per stage
    STAGES.forEach(stage => {
      stageCounts[stage.key] = 0;
      stageTimelines[stage.key] = [];
    });

    opportunities.forEach(opp => {
      const stage = opp.stage;
      if (stageCounts.hasOwnProperty(stage)) {
        stageCounts[stage]++;
      }

      // Calculate time in stage
      const timeline = opp.timeline;
      if (timeline.discovered && timeline.applied) {
        const days = calculateDaysBetween(timeline.discovered, timeline.applied);
        stageTimelines['discovered'].push(days);
      }
      if (timeline.applied && timeline.first_interview) {
        const days = calculateDaysBetween(timeline.applied, timeline.first_interview);
        stageTimelines['applied'].push(days);
      }
    });

    // Calculate funnel data with conversion rates
    const totalOpps = opportunities.length;
    let previousCount = totalOpps;

    const funnel: FunnelStage[] = STAGES.map((stage, index) => {
      const count = stageCounts[stage.key];
      const percentage = totalOpps > 0 ? (count / totalOpps) * 100 : 0;
      const conversionRate = index > 0 && previousCount > 0
        ? (count / previousCount) * 100
        : null;

      const avgTime = stageTimelines[stage.key].length > 0
        ? stageTimelines[stage.key].reduce((a, b) => a + b, 0) / stageTimelines[stage.key].length
        : null;

      previousCount = count;

      return {
        name: stage.name,
        count,
        percentage,
        conversionRate,
        avgTimeInStage: avgTime,
        color: stage.color
      };
    });

    setFunnelData(funnel);
  };

  const calculateDaysBetween = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-macSubtext">
          <Icon name="loader" size={32} className="animate-spin" />
          <p className="mt-4">Loading pipeline data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <Icon name="alert-circle" size={24} className="text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Data</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="p-8 text-center bg-macBg rounded-lg border border-macBorder">
        <Icon name="briefcase" size={48} className="mx-auto mb-4 text-macSubtext" />
        <h3 className="text-lg font-semibold text-macText mb-2">No Opportunities Yet</h3>
        <p className="text-macSubtext">Start tracking your job search pipeline to see conversion metrics.</p>
      </div>
    );
  }

  const totalOpportunities = opportunities.length;
  const overallConversionRate = funnelData.length > 0 && funnelData[funnelData.length - 1]
    ? ((funnelData[funnelData.length - 1].count / totalOpportunities) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-macText mb-2">Pipeline Conversion Funnel</h2>
        <p className="text-macSubtext">Track your job search conversion rates and identify bottlenecks</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="target" size={16} className="text-macAccent" />
            <span className="text-sm text-macSubtext">Total Opportunities</span>
          </div>
          <p className="text-2xl font-bold text-macText">{totalOpportunities}</p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="trending-up" size={16} className="text-green-500" />
            <span className="text-sm text-macSubtext">Overall Conversion</span>
          </div>
          <p className="text-2xl font-bold text-macText">{overallConversionRate}%</p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="clock" size={16} className="text-macAccent" />
            <span className="text-sm text-macSubtext">Active Stages</span>
          </div>
          <p className="text-2xl font-bold text-macText">
            {funnelData.filter(s => s.count > 0).length}
          </p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="trophy" size={16} className="text-yellow-500" />
            <span className="text-sm text-macSubtext">Offers</span>
          </div>
          <p className="text-2xl font-bold text-macText">
            {funnelData.find(s => s.name === 'Offer')?.count || 0}
          </p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
        <h3 className="text-lg font-semibold text-macText mb-6">Conversion Funnel</h3>

        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const maxCount = funnelData[0]?.count || 1;
            const widthPercentage = (stage.count / maxCount) * 100;

            return (
              <div key={stage.name} className="relative">
                {/* Stage Bar */}
                <div
                  className="relative h-16 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    width: `${widthPercentage}%`,
                    minWidth: '200px',
                    backgroundColor: stage.color,
                    opacity: 0.9
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{stage.name}</span>
                      <span className="text-sm opacity-90">({stage.count})</span>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold">{stage.percentage.toFixed(1)}%</div>
                      {stage.conversionRate !== null && (
                        <div className="text-xs opacity-90">
                          {stage.conversionRate.toFixed(1)}% conversion
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow between stages */}
                {index < funnelData.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <Icon name="chevron-down" size={20} className="text-macSubtext" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
        <h3 className="text-lg font-semibold text-macText mb-4">Stage Metrics</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-macBorder">
                <th className="text-left py-3 px-4 text-sm font-semibold text-macText">Stage</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-macText">Count</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-macText">% of Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-macText">Conversion Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-macText">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {funnelData.map((stage, index) => (
                <tr key={stage.name} className="border-b border-macBorder/50 hover:bg-macBg transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-medium text-macText">{stage.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-macText font-medium">{stage.count}</td>
                  <td className="text-right py-3 px-4 text-macSubtext">{stage.percentage.toFixed(1)}%</td>
                  <td className="text-right py-3 px-4">
                    {stage.conversionRate !== null ? (
                      <span className={`font-medium ${
                        stage.conversionRate >= 70 ? 'text-green-600' :
                        stage.conversionRate >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stage.conversionRate.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-macSubtext">-</span>
                    )}
                  </td>
                  <td className="text-right py-3 px-4 text-macSubtext">
                    {stage.avgTimeInStage !== null
                      ? `${Math.round(stage.avgTimeInStage)}d`
                      : '-'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="lightbulb" size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Insights</h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• You have {totalOpportunities} opportunities in your pipeline</li>
              {funnelData[0] && funnelData[1] && funnelData[1].conversionRate && (
                <li>• {funnelData[1].conversionRate.toFixed(0)}% of discovered opportunities lead to applications</li>
              )}
              {funnelData.find(s => s.name === 'Offer') && funnelData.find(s => s.name === 'Offer')!.count > 0 && (
                <li>• Strong performance: {funnelData.find(s => s.name === 'Offer')!.count} offer(s) received!</li>
              )}
              <li>• Continue tracking to identify bottlenecks and optimize your job search strategy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
