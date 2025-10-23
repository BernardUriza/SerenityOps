export type OpportunityStage = 'discovered' | 'applied' | 'interviewing' | 'offer' | 'closed';
export type OpportunityPriority = 'high' | 'medium' | 'low';
export type OpportunityOutcome = 'declined' | 'rejected' | 'accepted' | 'withdrawn' | null;

export interface OpportunityContact {
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
  source?: string;
}

export interface OpportunityTimeline {
  discovered: string | null;
  applied: string | null;
  first_interview: string | null;
  final_interview: string | null;
  offer_received: string | null;
  decision_deadline: string | null;
  closed?: string | null;
}

export interface OpportunityNote {
  date: string;
  content: string;
}

export interface OpportunityFitAnalysis {
  technical_match: number | null;  // 0.0-1.0 scale
  cultural_match: number | null;
  growth_potential: number | null;
  decline_reason?: string;
  red_flags: string[];
  green_flags: string[];
}

export interface OpportunityDetails {
  description: string;
  location: string;
  salary_range: string;
  work_schedule?: string;
  sector?: string;
  tech_stack: string[];
  benefits?: string[];
  requirements?: string[];
}

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  outcome?: OpportunityOutcome;
  details: OpportunityDetails;
  timeline: OpportunityTimeline;
  contacts: OpportunityContact[];
  notes: OpportunityNote[];
  fit_analysis: OpportunityFitAnalysis;
}

export interface OpportunitiesData {
  meta: {
    version: string;
    last_updated: string;
    owner: string;
    timezone: string;
  };
  pipeline: Opportunity[];
  active_count: {
    discovered: number;
    applied: number;
    interviewing: number;
    offer: number;
    closed: number;
    total: number;
  };
  goals: {
    weekly: {
      applications: number;
      networking_events: number;
      skill_development_hours: number;
    };
    monthly: {
      interviews_target: number;
      offers_target: number;
    };
  };
}

export interface CreateOpportunityRequest {
  company: string;
  role: string;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  details: Partial<OpportunityDetails>;
  contacts?: OpportunityContact[];
  notes?: OpportunityNote[];
}

export interface UpdateOpportunityRequest extends Partial<CreateOpportunityRequest> {
  id: string;
  outcome?: OpportunityOutcome;
  timeline?: Partial<OpportunityTimeline>;
  fit_analysis?: Partial<OpportunityFitAnalysis>;
}
