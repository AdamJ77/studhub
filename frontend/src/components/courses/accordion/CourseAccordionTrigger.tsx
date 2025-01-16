import { Course } from "@/src/models/Course";
import { Task } from "@/src/models/Task";
import { Requirement } from "@/src/models/Requirement";
import React from "react";

export enum Status {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export default function CourseAccordionTrigger({
  course,
}: {
  course: Course;
}) {
  const getTotalPointsRequirementStatus = (requirement: Requirement) => {
    const matchingTasks = course.tasks.filter(task => task.task_type === requirement.task_type);
    const tasksWithoutResult = matchingTasks.filter(task => task.result == null);

    const resultSum = matchingTasks.reduce((sum, task) => sum + (task.result ?? 0), 0);
    const possibleFutureResult = tasksWithoutResult.reduce((sum, task) => sum + task.max_points, 0);

    var pointsThreshold = requirement.threshold
    if (requirement.threshold_type == "Percent") {
      pointsThreshold *= matchingTasks.reduce((sum, task) => sum + task.max_points, 0);
      pointsThreshold /= 100;
    }

    if (resultSum >= pointsThreshold) {
      return Status.COMPLETED;
    }
    if (resultSum + possibleFutureResult >= pointsThreshold) {
      return Status.IN_PROGRESS;
    }
    return Status.FAILED;
  }

  const getSeparateRequirementStatus = (requirement: Requirement) => {
    const matchingTasks = course.tasks.filter(task => task.task_type === requirement.task_type);

    const getThresholdInPoints = (task: Task) => {
      if (requirement.threshold_type == "Percent") {
        return requirement.threshold * task.max_points / 100;
      }
      return requirement.threshold;
    }

    if (matchingTasks.every(task => task.result !== null && task.result >= getThresholdInPoints(task))) {
      return Status.COMPLETED;
    }
    if (matchingTasks.some(task => task.result !== null && task.result < getThresholdInPoints(task))) {
      return Status.FAILED;
    }
    return Status.IN_PROGRESS;
  }

  const getRequirementStatus = (requirement: Requirement) => {
    switch (requirement.requirement_type) {
      case "Total": {
        return getTotalPointsRequirementStatus(requirement);
      }
      case "Separately": {
        return getSeparateRequirementStatus(requirement);
      }
    }
  }

  const getCourseStatus = (course: Course) => {
    const requirementStatuses = course.requirements.map(getRequirementStatus);

    if (requirementStatuses.every(status => status === Status.COMPLETED)) {
      return Status.COMPLETED;
    }
    if (requirementStatuses.some(status => status === Status.FAILED)) {
      return Status.FAILED;
    }
    return Status.IN_PROGRESS;
  }

  const courseStatus = getCourseStatus(course);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.COMPLETED: {
        return "bg-green-700";
      }
      case Status.IN_PROGRESS: {
        return "bg-slate-500";
      }
      case Status.FAILED: {
        return "bg-red-200";
      }
    }
  }

  return (
    <div className="flex items-center justify-between w-full px-4">
      <div className="flex gap-4 items-center">
        <div
          style={{ backgroundColor: course.appearance.background_color }}
          className="w-4 h-4 aspect-square rounded-sm"
        />
        <p>{course.name}</p>
      </div>
      <div className={`${getStatusColor(courseStatus)} text-white px-2 rounded-full text-sm text-nowrap`}>{courseStatus}</div>
    </div>
  );
}
