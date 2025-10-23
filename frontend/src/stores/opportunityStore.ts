import { create } from 'zustand';
import type { Opportunity, OpportunitiesData, OpportunityStage } from '../types/opportunity';

interface OpportunityStore {
  // State
  opportunities: Opportunity[];
  data: OpportunitiesData | null;
  loading: boolean;
  error: string | null;
  selectedOpportunity: Opportunity | null;
  filterStage: OpportunityStage | 'all';

  // Actions
  setOpportunities: (opportunities: Opportunity[]) => void;
  setData: (data: OpportunitiesData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedOpportunity: (opportunity: Opportunity | null) => void;
  setFilterStage: (stage: OpportunityStage | 'all') => void;

  // CRUD operations (will call API)
  loadOpportunities: (apiBaseUrl: string) => Promise<void>;
  addOpportunity: (apiBaseUrl: string, opportunity: Partial<Opportunity>) => Promise<void>;
  updateOpportunity: (apiBaseUrl: string, id: string, updates: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (apiBaseUrl: string, id: string) => Promise<void>;

  // Computed/derived data
  getOpportunitiesByStage: (stage: OpportunityStage) => Opportunity[];
  getActiveOpportunities: () => Opportunity[];
  getClosedOpportunities: () => Opportunity[];
}

export const useOpportunityStore = create<OpportunityStore>((set, get) => ({
  // Initial state
  opportunities: [],
  data: null,
  loading: false,
  error: null,
  selectedOpportunity: null,
  filterStage: 'all',

  // Basic setters
  setOpportunities: (opportunities) => set({ opportunities }),
  setData: (data) => set({ data, opportunities: data.pipeline }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedOpportunity: (opportunity) => set({ selectedOpportunity: opportunity }),
  setFilterStage: (stage) => set({ filterStage: stage }),

  // Load all opportunities from API
  loadOpportunities: async (apiBaseUrl: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiBaseUrl}/api/opportunities`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json() as OpportunitiesData;
      set({ data, opportunities: data.pipeline, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load opportunities';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add new opportunity
  addOpportunity: async (apiBaseUrl: string, opportunity: Partial<Opportunity>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiBaseUrl}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opportunity)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Reload all opportunities to get updated data
      await get().loadOpportunities(apiBaseUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add opportunity';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update existing opportunity
  updateOpportunity: async (apiBaseUrl: string, id: string, updates: Partial<Opportunity>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiBaseUrl}/api/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Reload all opportunities to get updated data
      await get().loadOpportunities(apiBaseUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update opportunity';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete opportunity
  deleteOpportunity: async (apiBaseUrl: string, id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiBaseUrl}/api/opportunities/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Reload all opportunities to get updated data
      await get().loadOpportunities(apiBaseUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete opportunity';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Get opportunities by stage
  getOpportunitiesByStage: (stage: OpportunityStage) => {
    return get().opportunities.filter(opp => opp.stage === stage);
  },

  // Get active opportunities (not closed)
  getActiveOpportunities: () => {
    return get().opportunities.filter(opp => opp.stage !== 'closed');
  },

  // Get closed opportunities
  getClosedOpportunities: () => {
    return get().opportunities.filter(opp => opp.stage === 'closed');
  }
}));
