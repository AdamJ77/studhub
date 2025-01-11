import { Requirement } from "@/src/models/Requirement";
import React from "react";
import { Progress } from "../../ui/progress";
import { Task } from "@/src/models/Task";

export default function CoursesAccordionRequirement({
  requirement,
  tasks,
}: {
  requirement: Requirement;
  tasks: Task[];
}) {
  const getStartText = (): string => {
    if (requirement.requirement_type === "Total")
      return "Z sumy wszystkich zaliczeń typu: ";
    else if (requirement.requirement_type === "Separately")
      return "Z każdego zaliczenia typu: ";
    throw new Error("Invalid requirement type!");
  };

  const getEndText = (): string => {
    if (requirement.threshold_type === "Points")
      return ` należy zdobyć: minimum ${requirement.threshold} punktów`;
    else if (requirement.threshold_type === "Percent")
      return ` należy zdobyć: ${requirement.threshold}% punktów`;
    throw new Error("Invalid requirement threshold type!");
  };

  const calculateScore = (): number => {
    const filteredTasksByType = tasks.filter(
      (task) => task.task_type === requirement.task_type
    );

    if (requirement.requirement_type === "Total") {
      if (requirement.threshold_type === "Points") {
        const numerator = filteredTasksByType.reduce(
          (prev, current) => prev + (current.result ? current.result : 0),
          0
        );
        const denumrator = requirement.threshold;
        return Math.round((numerator / denumrator) * 10000) / 100;
      } else {
        const numerator = filteredTasksByType.reduce(
          (prev, current) => prev + (current.result ? current.result : 0),
          0
        );
        const denumrator = filteredTasksByType.reduce(
          (prev, current) => prev + current.max_points,
          0
        );
        return (
          (Math.round((numerator / denumrator) * 100) / requirement.threshold) *
          100
        );
      }
    } else {
      if (requirement.threshold_type === "Points") {
        const numerator = filteredTasksByType.reduce((prev, current) => {
          if (!current.result) return prev;
          return prev + current.result >= requirement.threshold ? 1 : 0;
        }, 0);
        const denumrator = filteredTasksByType.length;

        return Math.round((numerator / denumrator) * 10000) / 100;
      } else {
        const numerator = filteredTasksByType.reduce((prev, current) => {
          if (!current.result) return prev;
          return prev + (current.result / current.max_points) * 100 >=
            requirement.threshold
            ? prev + 1
            : 0;
        }, 0);
        const denumrator = filteredTasksByType.length;
        return Math.round((numerator / denumrator) * 10000) / 100;
      }
    }
  };

  const score = calculateScore();

  return (
    <div className="p-4">
      <p>
        {getStartText()}
        <span className="font-bold">{requirement.task_type}</span>
        {getEndText()}
      </p>
      <div className="mt-4 relative">
        <Progress value={Math.min(score, 100)} indicatorColor="bg-blue-500" className="bg-slate-300"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold z-100">
          {score}%
        </div>
      </div>
    </div>
  );
}
