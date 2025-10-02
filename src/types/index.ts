// TypeScript interfaces for Kanban Board

export interface KanbanTask {
  id: number;
  title: string;
  description?: string;
  phase_id: number;
  project_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanPhase {
  id: number;
  name: string;
  order: number;
  project_id: number;
  tasks: KanbanTask[];
  task_count: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanBoard {
  id: number;
  project_id: number;
  phases: KanbanPhase[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
