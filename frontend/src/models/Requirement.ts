import { TaskType } from "./Task";

export type Requirement = {
  task_type: TaskType;
  requirement_type: "Total" | "Separately";
  threshold: number;
  threshold_type: "Points" | "Percent";
};
