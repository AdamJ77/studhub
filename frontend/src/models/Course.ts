import { Requirement } from "./Requirement";
import { Task } from "./Task";

export type Course = {
  id: string;
  name: string;
  accent_color: string;
  tasks: Task[];
  requirements: Requirement[];
};
