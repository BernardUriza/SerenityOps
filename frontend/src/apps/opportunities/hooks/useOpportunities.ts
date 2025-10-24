// useOpportunities Hook - Core opportunity management logic
// Integrates with opportunitiesService and handles state management

import { useState, useEffect, useCallback } from 'react';
import { opportunitiesService } from '../services/opportunitiesService';
import type { Opportunity, OpportunityStatus } from '../types';

export interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  fetchOpportunities: () => Promise<void>;
  createOpportunity: (opp: Partial<Opportunity>) => Promise<void>;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  filterByStatus: (status?: OpportunityStatus) => Opportunity[];
  searchOpportunities: (query: string) => Opportunity[];
}

export function useOpportunities(apiBase?: string): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Fetch all opportunities
  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await opportunitiesService.fetchOpportunities();
      setOpportunities(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch opportunities';
      setError(message);
      console.error('[useOpportunities] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new opportunity
  const createOpportunity = useCallback(async (opp: Partial<Opportunity>) => {
    try {
      setLoading(true);
      setError(null);
      const newOpp = await opportunitiesService.createOpportunity(opp);
      setOpportunities((prev) => [...prev, newOpp]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create opportunity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing opportunity
  const updateOpportunity = useCallback(async (id: string, updates: Partial<Opportunity>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOpp = await opportunitiesService.updateOpportunity(id, updates);
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? updatedOpp : opp))
      );
      if (selectedOpportunity?.id === id) {
        setSelectedOpportunity(updatedOpp);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update opportunity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOpportunity]);

  // Delete opportunity
  const deleteOpportunity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await opportunitiesService.deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
      if (selectedOpportunity?.id === id) {
        setSelectedOpportunity(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete opportunity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOpportunity]);

  // Filter by status
  const filterByStatus = useCallback(
    (status?: OpportunityStatus): Opportunity[] => {
      if (!status) return opportunities;
      return opportunities.filter((opp) => opp.status === status);
    },
    [opportunities]
  );

  // Search opportunities
  const searchOpportunities = useCallback(
    (query: string): Opportunity[] => {
      if (!query.trim()) return opportunities;
      const lowerQuery = query.toLowerCase();
      return opportunities.filter(
        (opp) =>
          opp.company.toLowerCase().includes(lowerQuery) ||
          opp.role.toLowerCase().includes(lowerQuery) ||
          opp.details.description.toLowerCase().includes(lowerQuery) ||
          opp.details.tech_stack.some((tech) => tech.toLowerCase().includes(lowerQuery))
      );
    },
    [opportunities]
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    loading,
    error,
    selectedOpportunity,
    setSelectedOpportunity,
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    filterByStatus,
    searchOpportunities,
  };
}
