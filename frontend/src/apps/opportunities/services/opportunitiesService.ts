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
  // Data Mapping Helpers
  // ============================================

  private mapYamlToOpportunity(yamlData: any): Opportunity {
    // Map YAML structure to TypeScript interface
    return {
      id: yamlData.id,
      company: yamlData.company,
      role: yamlData.role,
      status: (yamlData.stage || yamlData.status || 'active') as any, // YAML uses "stage"
      priority: (yamlData.priority || 'medium') as any,
      created_at: yamlData.timeline?.discovered || yamlData.created_at || new Date().toISOString(),
      updated_at: yamlData.timeline?.applied || yamlData.updated_at || new Date().toISOString(),
      next_action: this.extractNextAction(yamlData),
      next_action_date: yamlData.timeline?.first_interview || yamlData.next_action_date,
      details: {
        description: yamlData.details?.description || '',
        location: yamlData.details?.location || '',
        salary_range: yamlData.details?.salary_range,
        tech_stack: yamlData.details?.tech_stack || [],
        requirements: yamlData.details?.requirements || [],
        benefits: yamlData.details?.benefits,
        url: yamlData.details?.url,
      },
      fit_analysis: yamlData.fit_analysis ? {
        skills_match_percentage: Math.round((yamlData.fit_analysis.technical_match || 0) * 100),
        stack_overlap: yamlData.details?.tech_stack || [],
        gaps: yamlData.fit_analysis.red_flags || [],
        keywords_for_cv: [],
        red_flags: yamlData.fit_analysis.red_flags || [],
        green_flags: yamlData.fit_analysis.green_flags || [],
        claude_insight: yamlData.fit_analysis.decline_reason || this.generateInsight(yamlData),
      } : undefined,
      timeline: yamlData.timeline,
      interview_prep: yamlData.preparation_docs ? {
        star_stories: yamlData.preparation_docs,
        questions_prepared: [],
        research_notes: yamlData.notes?.map((n: any) => n.content || n) || [],
      } : undefined,
      notes: yamlData.notes?.map((n: any) => typeof n === 'string' ? n : n.content) || [],
      tags: this.extractTags(yamlData),
    };
  }

  private extractNextAction(yamlData: any): string | undefined {
    // Check for explicit next_action field
    if (yamlData.next_action) return yamlData.next_action;

    // Extract from most recent note
    if (yamlData.notes && yamlData.notes.length > 0) {
      const latestNote = yamlData.notes[yamlData.notes.length - 1];
      const content = typeof latestNote === 'string' ? latestNote : latestNote.content;
      if (content && content.includes('STRATEGY:')) {
        return content.split('STRATEGY:')[1]?.split('.')[0]?.trim();
      }
    }

    // Generate based on stage
    if (yamlData.stage === 'interviewing' && yamlData.timeline?.first_interview) {
      return `Interview on ${yamlData.timeline.first_interview}`;
    }

    return undefined;
  }

  private generateInsight(yamlData: any): string {
    const match = yamlData.fit_analysis?.technical_match || 0;
    if (match >= 0.8) return 'Strong technical match - prioritize this opportunity';
    if (match >= 0.6) return 'Good fit with some skill gaps to address';
    return 'Consider skill development before applying';
  }

  private extractTags(yamlData: any): string[] {
    const tags: string[] = [];
    if (yamlData.priority === 'high') tags.push('high-priority');
    if (yamlData.details?.location?.includes('Remote')) tags.push('remote');
    if (yamlData.stage === 'interviewing') tags.push('active-interview');
    if (yamlData.outcome === 'declined') tags.push('declined');
    return tags;
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
      const pipeline = data.pipeline || [];

      // Map YAML structure to TypeScript interfaces
      return pipeline.map((item: any) => this.mapYamlToOpportunity(item));
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
      const url = `${this.apiBase}/api/opportunities/pitch/${encodeURIComponent(company)}`;
      const response = await fetch(url);

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
