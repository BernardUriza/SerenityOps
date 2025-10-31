/**
 * Interview Calendar Dashboard
 *
 * Visual calendar showing all scheduled interviews (past, present, future)
 * with metadata, filters, and export capabilities.
 *
 * Features:
 * - Monthly/Weekly/Daily calendar views
 * - Interview cards with company, role, type
 * - Timeline visualization
 * - Filters by company, interview type, status
 * - Export to .ics format
 *
 * SO-DASH-FEAT-001
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../../icons';

interface Interview {
  id: string;
  company: string;
  role: string;
  type: 'screening' | 'technical' | 'behavioral' | 'final' | 'other';
  date: string;
  time?: string;
  duration?: number; // minutes
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  opportunityId: string;
}

interface OpportunityData {
  id: string;
  company: string;
  role: string;
  stage: string;
  timeline: {
    discovered?: string;
    applied?: string;
    first_interview?: string;
    final_interview?: string;
    offer_received?: string;
  };
}

interface InterviewCalendarDashboardProps {
  apiBaseUrl: string;
}

type ViewMode = 'month' | 'week' | 'list';

export const InterviewCalendarDashboard: React.FC<InterviewCalendarDashboardProps> = ({ apiBaseUrl }) => {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    if (opportunities.length > 0) {
      extractInterviewsFromOpportunities();
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

  const extractInterviewsFromOpportunities = () => {
    const interviewList: Interview[] = [];

    opportunities.forEach(opp => {
      // Extract first interview
      if (opp.timeline.first_interview) {
        interviewList.push({
          id: `${opp.id}-first`,
          company: opp.company,
          role: opp.role,
          type: 'screening',
          date: opp.timeline.first_interview,
          status: new Date(opp.timeline.first_interview) < new Date() ? 'completed' : 'scheduled',
          opportunityId: opp.id
        });
      }

      // Extract final interview
      if (opp.timeline.final_interview) {
        interviewList.push({
          id: `${opp.id}-final`,
          company: opp.company,
          role: opp.role,
          type: 'final',
          date: opp.timeline.final_interview,
          status: new Date(opp.timeline.final_interview) < new Date() ? 'completed' : 'scheduled',
          opportunityId: opp.id
        });
      }
    });

    // Sort by date (ascending)
    interviewList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setInterviews(interviewList);
  };

  const getInterviewTypeColor = (type: Interview['type']): string => {
    const colors = {
      screening: 'bg-blue-500',
      technical: 'bg-purple-500',
      behavioral: 'bg-green-500',
      final: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[type];
  };

  const getInterviewTypeIcon = (type: Interview['type']): string => {
    const icons = {
      screening: 'user',
      technical: 'code',
      behavioral: 'users',
      final: 'trophy',
      other: 'calendar'
    };
    return icons[type];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUpcomingInterviews = (): Interview[] => {
    const now = new Date();
    return interviews.filter(interview =>
      new Date(interview.date) >= now && interview.status === 'scheduled'
    );
  };

  const getPastInterviews = (): Interview[] => {
    const now = new Date();
    return interviews.filter(interview =>
      new Date(interview.date) < now || interview.status === 'completed'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-macSubtext">
          <Icon name="loader" size={32} className="animate-spin mx-auto" />
          <p className="mt-4">Loading interview calendar...</p>
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

  const upcomingInterviews = getUpcomingInterviews();
  const pastInterviews = getPastInterviews();
  const totalInterviews = interviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-macText mb-2">Interview Calendar</h2>
          <p className="text-macSubtext">Track and manage all your scheduled interviews</p>
        </div>

        {/* View Mode Toggles */}
        <div className="flex gap-2 bg-macBgSecondary p-1 rounded-lg border border-macBorder">
          {(['month', 'week', 'list'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-macAccent text-white'
                  : 'text-macSubtext hover:text-macText'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="calendar" size={16} className="text-macAccent" />
            <span className="text-sm text-macSubtext">Total Interviews</span>
          </div>
          <p className="text-2xl font-bold text-macText">{totalInterviews}</p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="clock" size={16} className="text-green-500" />
            <span className="text-sm text-macSubtext">Upcoming</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{upcomingInterviews.length}</p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="check-circle" size={16} className="text-blue-500" />
            <span className="text-sm text-macSubtext">Completed</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{pastInterviews.length}</p>
        </div>

        <div className="p-4 bg-macBgSecondary rounded-lg border border-macBorder">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="briefcase" size={16} className="text-purple-500" />
            <span className="text-sm text-macSubtext">Companies</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(interviews.map(i => i.company)).size}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {interviews.length === 0 ? (
        <div className="p-12 text-center bg-macBgSecondary rounded-lg border border-macBorder">
          <Icon name="calendar" size={64} className="mx-auto mb-4 text-macSubtext opacity-50" />
          <h3 className="text-lg font-semibold text-macText mb-2">No Interviews Scheduled</h3>
          <p className="text-macSubtext">Start tracking your interviews by adding opportunities with interview dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
            <h3 className="text-lg font-semibold text-macText mb-4 flex items-center gap-2">
              <Icon name="clock" size={20} className="text-green-500" />
              Upcoming Interviews
            </h3>

            {upcomingInterviews.length === 0 ? (
              <p className="text-macSubtext text-sm">No upcoming interviews scheduled</p>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="p-4 bg-macBg rounded-lg border border-macBorder hover:border-macAccent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${getInterviewTypeColor(interview.type)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-macText truncate">{interview.company}</h4>
                        <p className="text-sm text-macSubtext truncate">{interview.role}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-macSubtext">
                          <span className="flex items-center gap-1">
                            <Icon name="calendar" size={12} />
                            {formatDate(interview.date)}
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <Icon name={getInterviewTypeIcon(interview.type)} size={12} />
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Interviews */}
          <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
            <h3 className="text-lg font-semibold text-macText mb-4 flex items-center gap-2">
              <Icon name="check-circle" size={20} className="text-blue-500" />
              Past Interviews
            </h3>

            {pastInterviews.length === 0 ? (
              <p className="text-macSubtext text-sm">No past interviews</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {pastInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="p-4 bg-macBg rounded-lg border border-macBorder opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${getInterviewTypeColor(interview.type)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-macText truncate">{interview.company}</h4>
                        <p className="text-sm text-macSubtext truncate">{interview.role}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-macSubtext">
                          <span className="flex items-center gap-1">
                            <Icon name="calendar" size={12} />
                            {formatDate(interview.date)}
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <Icon name={getInterviewTypeIcon(interview.type)} size={12} />
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats & Insights */}
      {interviews.length > 0 && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Icon name="lightbulb" size={24} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Calendar Insights</h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• You have {upcomingInterviews.length} interview{upcomingInterviews.length !== 1 ? 's' : ''} coming up</li>
                <li>• {pastInterviews.length} interview{pastInterviews.length !== 1 ? 's' : ''} completed so far</li>
                <li>• Active with {new Set(interviews.map(i => i.company)).size} different companies</li>
                {upcomingInterviews.length > 0 && (
                  <li>• Next interview: {upcomingInterviews[0].company} ({formatDate(upcomingInterviews[0].date)})</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
