// Opportunities Service - API Integration
// Handles all backend communication for Opportunities Viewer

import type {
  Opportunity,
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
  FeedbackEntry,
} from '../types';

const DEFAULT_API_BASE = 'http://localhost:8000';

class OpportunitiesService {
  private apiBase: string;

  constructor(apiBase: string = DEFAULT_API_BASE) {
    this.apiBase = apiBase;
  }

  // ============================================
  // Core CRUD Operations
  // ============================================

  async fetchOpportunities(): Promise<Opportunity[]> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
      }
      const data = await response.json();
      return data.pipeline || [];
    } catch (error) {
      console.error('[OpportunitiesService] Error fetching opportunities:', error);
      throw error;
    }
  }

  async fetchOpportunity(id: string): Promise<Opportunity> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunity: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[OpportunitiesService] Error fetching opportunity ${id}:`, error);
      throw error;
    }
  }

  async createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opportunity),
      });
      if (!response.ok) {
        throw new Error(`Failed to create opportunity: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error creating opportunity:', error);
      throw error;
    }
  }

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Failed to update opportunity: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[OpportunitiesService] Error updating opportunity ${id}:`, error);
      throw error;
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete opportunity: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`[OpportunitiesService] Error deleting opportunity ${id}:`, error);
      throw error;
    }
  }

  // ============================================
  // Claude Actions CMS
  // ============================================

  async analyzeJobDescription(
    request: AnalyzeJobDescriptionRequest
  ): Promise<AnalyzeJobDescriptionResponse> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to analyze job description: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error analyzing job description:', error);
      throw error;
    }
  }

  async improvePitch(
    opportunityId: string,
    request: ImprovePitchRequest
  ): Promise<ImprovePitchResponse> {
    try {
      const response = await fetch(
        `${this.apiBase}/api/opportunities/${opportunityId}/pitch/improve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to improve pitch: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error improving pitch:', error);
      throw error;
    }
  }

  async generateMockInterview(
    opportunityId: string,
    request: MockInterviewRequest
  ): Promise<MockInterviewResponse> {
    try {
      const response = await fetch(
        `${this.apiBase}/api/opportunities/${opportunityId}/mock-interview`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to generate mock interview: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error generating mock interview:', error);
      throw error;
    }
  }

  async compareOpportunities(
    request: CompareOpportunitiesRequest
  ): Promise<ComparisonResult> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to compare opportunities: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error comparing opportunities:', error);
      throw error;
    }
  }

  async generateCareerStrategy(
    request: CareerStrategyRequest
  ): Promise<CareerStrategy> {
    try {
      const response = await fetch(`${this.apiBase}/api/opportunities/career-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to generate career strategy: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error generating career strategy:', error);
      throw error;
    }
  }

  // ============================================
  // Feedback & Pitch Operations
  // ============================================

  async fetchFeedbackHistory(company?: string): Promise<FeedbackEntry[]> {
    try {
      const url = company
        ? `${this.apiBase}/api/opportunities/feedback?company=${encodeURIComponent(company)}`
        : `${this.apiBase}/api/opportunities/feedback`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch feedback history: ${response.statusText}`);
      }
      const data = await response.json();
      return data.feedback || [];
    } catch (error) {
      console.error('[OpportunitiesService] Error fetching feedback history:', error);
      throw error;
    }
  }

  async fetchElevatorPitch(company: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.apiBase}/api/opportunities/pitch/${encodeURIComponent(company)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch elevator pitch: ${response.statusText}`);
      }
      const data = await response.json();
      return data.pitch || '';
    } catch (error) {
      console.error('[OpportunitiesService] Error fetching elevator pitch:', error);
      throw error;
    }
  }

  async saveElevatorPitch(company: string, pitch: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiBase}/api/opportunities/pitch/${encodeURIComponent(company)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pitch }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to save elevator pitch: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[OpportunitiesService] Error saving elevator pitch:', error);
      throw error;
    }
  }

  // ============================================
  // Interview Preparation
  // ============================================

  async fetchInterviewMaterials(opportunityId: string): Promise<{
    star_stories: string;
    runbook: string;
    questions_bank: string;
  }> {
    try {
      const response = await fetch(
        `${this.apiBase}/api/opportunities/${opportunityId}/prepare`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch interview materials: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('[OpportunitiesService] Error fetching interview materials:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const opportunitiesService = new OpportunitiesService();
export default OpportunitiesService;
