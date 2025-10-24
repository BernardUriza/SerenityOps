// Opportunities Viewer - Type Definitions
// macOS Aesthetic + Claude Actions Integration

export type OpportunityStatus = 'discovered' | 'applied' | 'interviewing' | 'offer' | 'closed' | 'active' | 'paused';
export type OpportunityPriority = 'low' | 'medium' | 'high';
export type ClaudeActionType =
  | 'analyze_job_description'
  | 'improve_pitch'
  | 'mock_interview'
  | 'compare_opportunities'
  | 'career_strategy';

export interface OpportunityBase {
  id: string;
  company: string;
  role: string;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  created_at: string;
  updated_at: string;
  next_action?: string;
  next_action_date?: string;
}

export interface OpportunityDetails {
  description: string;
  location: string;
  salary_range?: string;
  tech_stack: string[];
  requirements: string[];
  benefits?: string[];
  url?: string;
}

export interface FitAnalysis {
  skills_match_percentage: number;
  stack_overlap: string[];
  gaps: string[];
  keywords_for_cv: string[];
  red_flags: string[];
  green_flags: string[];
  claude_insight?: string;
}

export interface Timeline {
  discovered?: string;
  applied?: string;
  first_interview?: string;
  technical_interview?: string;
  final_interview?: string;
  offer_received?: string;
  decision_deadline?: string;
}

export interface InterviewPrep {
  elevator_pitch?: string;
  star_stories?: string[];
  questions_for_manager?: string[];
  technical_prep?: string[];
  company_research?: string;
}

export interface Opportunity extends OpportunityBase {
  details: OpportunityDetails;
  fit_analysis?: FitAnalysis;
  timeline?: Timeline;
  interview_prep?: InterviewPrep;
  notes: string[];
  tags: string[];
}

export interface ClaudeAction {
  id: string;
  type: ClaudeActionType;
  status: 'pending' | 'processing' | 'completed' | 'error';
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface ComparisonResult {
  opportunity_a: Opportunity;
  opportunity_b: Opportunity;
  stack_comparison: {
    common: string[];
    only_a: string[];
    only_b: string[];
  };
  fit_comparison: {
    a_score: number;
    b_score: number;
    winner: 'a' | 'b' | 'tie';
  };
  risk_analysis: {
    a_risks: string[];
    b_risks: string[];
  };
  claude_recommendation?: string;
}

export interface FeedbackEntry {
  date: string;
  company: string;
  type: 'technical' | 'behavioral' | 'culture';
  topic: string;
  feedback: string;
  rating?: number;
  learnings?: string[];
  action_items?: string[];
}

export interface CareerStrategyInput {
  current_role?: string;
  target_role?: string;
  timeline_months?: number;
  constraints?: string[];
  goals?: string[];
}

export interface CareerStrategy {
  phases: {
    name: string;
    duration_weeks: number;
    actions: string[];
    milestones: string[];
  }[];
  skills_to_develop: string[];
  networking_strategy: string[];
  search_tactics: string[];
  risk_mitigation: string[];
  claude_guidance?: string;
}

// API Request/Response Types
export interface AnalyzeJobDescriptionRequest {
  job_description: string;
  your_skills: string[];
}

export interface AnalyzeJobDescriptionResponse {
  fit_analysis: FitAnalysis;
  summary: string;
}

export interface ImprovePitchRequest {
  current_pitch: string;
  job_description?: string;
}

export interface ImprovePitchResponse {
  improved_pitch: string;
  changes_made: string[];
  tips: string[];
}

export interface MockInterviewRequest {
  interview_type: 'technical' | 'behavioral' | 'manager';
  difficulty: 'easy' | 'medium' | 'hard';
  focus_areas: string[];
}

export interface MockInterviewResponse {
  questions: {
    question: string;
    focus: string;
    ideal_answer_structure: string;
  }[];
  tips: string[];
}

export interface CompareOpportunitiesRequest {
  opportunity_a_id: string;
  opportunity_b_id: string;
}

export interface CareerStrategyRequest {
  opportunity_ids: string[];
  career_goals: string;
  constraints: string[];
  time_horizon: string;
}

export interface OpportunitiesState {
  opportunities: Opportunity[];
  selected_opportunity?: Opportunity;
  comparison?: ComparisonResult;
  active_claude_action?: ClaudeAction;
  loading: boolean;
  error?: string;
}
