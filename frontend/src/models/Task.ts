export type TaskType = "Laboratorium" | "Projekt";

export type Task = {
  max_points: number;
  result: number | null;
  deadline: Date;
  task_type: TaskType;
  description: string;
};
