// Single source of truth for shared types. If a type is used in more than one
// file, it lives here.

// ─── Business ────────────────────────────────────────────────────────────────
export type Industry =
  | "ecommerce"
  | "agency"
  | "saas"
  | "creator"
  | "services"
  | "other";

export type RevenueBucket = "<10k" | "10-50k" | "50-250k" | "250k+";
export type TeamSize = "solo" | "2-5" | "6-20" | "20+";

export interface BusinessProfile {
  id: string;
  user_id: string;
  name: string;
  industry: Industry;
  audience: string | null;
  primary_goal: string;
  current_tools: string[];
  monthly_revenue: RevenueBucket | null;
  team_size: TeamSize | null;
  constraints: string | null;
  context_summary: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Lessons ─────────────────────────────────────────────────────────────────
export type LessonTrack = "fundamentals" | "customer-ops" | "sales" | "content";
export type Tier = "free" | "pro" | "operator";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  track: LessonTrack;
  position: number;
  duration_min: number;
  summary: string;
  body_md: string;
  action_prompt: string | null;
  required_tier: Tier;
  published: boolean;
  created_at: string;
}

// ─── Workflow graph — the heart of the System Builder ────────────────────────
export type NodeKind =
  | "trigger"     // what kicks off the workflow
  | "ai-step"     // an AI-powered transformation
  | "tool-call"   // an integration / API call
  | "decision"    // a branch
  | "output";     // where the result goes

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;        // human-readable name shown in the graph
  description: string;  // 1-2 sentences of what this step does
  config: Record<string, unknown>; // kind-specific settings (model, prompt, target, etc.)
}

export interface WorkflowEdge {
  from: string; // node id
  to: string;   // node id
  condition?: string; // for branches
}

export interface WorkflowGraph {
  version: 1;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface Workflow {
  id: string;
  business_id: string;
  template_id: string | null;
  name: string;
  description: string | null;
  graph: WorkflowGraph;
  status: "draft" | "active" | "paused" | "archived";
  activated_at: string | null;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplate {
  id: string;
  slug: string;
  name: string;
  category: string;
  archetype: string;
  short_pitch: string;
  description_md: string;
  default_graph: WorkflowGraph;
  required_tier: Tier;
}

// ─── AI layer ────────────────────────────────────────────────────────────────
export type AITask =
  | "lesson-personalization"
  | "workflow-synthesis"
  | "agent-execution"
  | "recommendation";

export interface AIRequest {
  task: AITask;
  input: string;
  businessContext?: BusinessProfile | null;
  // Optional structured output schema name (the route handles parsing).
  schema?: "WorkflowGraph" | "RecommendationList" | null;
}

export interface AIResponse {
  text: string;
  // When a schema was requested, the parsed object lands here.
  parsed?: unknown;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  latency_ms: number;
  mock?: boolean;
}

// ─── Readiness Score ─────────────────────────────────────────────────────────
export interface ReadinessScore {
  business_id: string;
  breadth_score: number;     // 0-40
  depth_score: number;       // 0-30
  learning_score: number;    // 0-20
  integration_score: number; // 0-10
  total_score: number;       // 0-100
}

// ─── Recommendations ─────────────────────────────────────────────────────────
export type RecommendationKind =
  | "new_workflow"
  | "optimize_workflow"
  | "next_lesson";

export interface Recommendation {
  id: string;
  business_id: string;
  kind: RecommendationKind;
  title: string;
  rationale: string;
  cta_label: string;
  cta_target: string;
  priority: number;
  dismissed: boolean;
  acted_on: boolean;
  created_at: string;
}
