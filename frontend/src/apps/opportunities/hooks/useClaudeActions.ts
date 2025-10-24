// useClaudeActions Hook - Claude API integration for intelligent analysis
// Provides actions: analyze JD, improve pitch, mock interview, compare, strategy

import { useState, useCallback } from 'react';
import { opportunitiesService } from '../services/opportunitiesService';
import type {
  AnalyzeJobDescriptionRequest,
  AnalyzeJobDescriptionResponse,
  ImprovePitchRequest,
  ImprovePitchResponse,
  MockInterviewRequest,
  MockInterviewResponse,
  CompareOpportunitiesRequest,
  ComparisonResult,
  CareerStrategyRequest,
  CareerStrategy,
} from '../types';

export interface UseClaudeActionsReturn {
  loading: boolean;
  error: string | null;
  analyzeJobDescription: (req: AnalyzeJobDescriptionRequest) => Promise<AnalyzeJobDescriptionResponse | null>;
  improvePitch: (oppId: string, req: ImprovePitchRequest) => Promise<ImprovePitchResponse | null>;
  generateMockInterview: (oppId: string, req: MockInterviewRequest) => Promise<MockInterviewResponse | null>;
  compareOpportunities: (req: CompareOpportunitiesRequest) => Promise<ComparisonResult | null>;
  generateCareerStrategy: (req: CareerStrategyRequest) => Promise<CareerStrategy | null>;
}

export function useClaudeActions(): UseClaudeActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeJobDescription = useCallback(
    async (req: AnalyzeJobDescriptionRequest): Promise<AnalyzeJobDescriptionResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.analyzeJobDescription(req);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to analyze job description';
        setError(message);
        console.error('[useClaudeActions] Analyze JD error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const improvePitch = useCallback(
    async (oppId: string, req: ImprovePitchRequest): Promise<ImprovePitchResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.improvePitch(oppId, req);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to improve pitch';
        setError(message);
        console.error('[useClaudeActions] Improve pitch error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateMockInterview = useCallback(
    async (oppId: string, req: MockInterviewRequest): Promise<MockInterviewResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.generateMockInterview(oppId, req);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate mock interview';
        setError(message);
        console.error('[useClaudeActions] Mock interview error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const compareOpportunities = useCallback(
    async (req: CompareOpportunitiesRequest): Promise<ComparisonResult | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.compareOpportunities(req);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to compare opportunities';
        setError(message);
        console.error('[useClaudeActions] Compare error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateCareerStrategy = useCallback(
    async (req: CareerStrategyRequest): Promise<CareerStrategy | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.generateCareerStrategy(req);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate career strategy';
        setError(message);
        console.error('[useClaudeActions] Career strategy error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    analyzeJobDescription,
    improvePitch,
    generateMockInterview,
    compareOpportunities,
    generateCareerStrategy,
  };
}
