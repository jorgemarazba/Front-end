// Tipos generados desde InvestiFlow OpenAPI

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  phone_number: string;
  university?: string | null;
  research_group?: string | null;
  career?: string | null;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string | null;
  university?: string | null;
  research_group?: string | null;
  career?: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  full_name?: string | null;
  phone_number?: string | null;
  university?: string | null;
  research_group?: string | null;
  career?: string | null;
}

export interface ProjectCreate {
  name: string;
  description?: string | null;
  research_type?: ResearchType | null;
  institution?: string | null;
  research_group?: string | null;
  category?: string | null;
  status?: ProjectStatus | null;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string | null;
  research_type?: ResearchType | null;
  institution?: string | null;
  research_group?: string | null;
  category?: string | null;
  status?: ProjectStatus | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  id: number;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  research_type?: ResearchType | null;
  category?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  name?: string | null;
  description?: string | null;
  research_type?: ResearchType | null;
  institution?: string | null;
  research_group?: string | null;
  category?: string | null;
  status?: ProjectStatus | null;
}

export type ResearchType =
  | "basic"
  | "applied"
  | "experimental"
  | "theoretical"
  | "qualitative"
  | "quantitative"
  | "mixed";

export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface LoginBody {
  grant_type?: "password" | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

// Tipos para el sistema Kanban
export interface KanbanTask {
  id: number;
  title: string;
  description?: string;
  phase_id: number;
  project_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
}

export interface KanbanPhase {
  id: number;
  name: string;
  description?: string;
  color: string;
  position: number;
  project_id: number;
  tasks: KanbanTask[];
  task_count?: number;
}

export interface KanbanBoard {
  id: number;
  project_id: number;
  phases: KanbanPhase[];
  created_at: string;
  updated_at: string;
}

// Tipos para operaciones CRUD del Kanban
export interface CreateTaskRequest {
  title: string;
  description?: string;
  phase_id: number;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  phase_id?: number;
  position?: number;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
}

export interface MoveTaskRequest {
  task_id: number;
  target_phase_id: number;
  new_position: number;
}

export interface CreatePhaseRequest {
  name: string;
  description?: string;
  color: string;
  position: number;
}

export interface UpdatePhaseRequest {
  name?: string;
  description?: string;
  color?: string;
  position?: number;
}
