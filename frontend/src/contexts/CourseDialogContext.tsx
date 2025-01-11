import React, { createContext, useContext, useEffect, useState } from "react";
import { Course } from "../models/Course";
import { Requirement } from "../models/Requirement";
import { RequirementBD } from "../models/RequirementBD";
import { Task } from "../models/Task";
import { TaskBD } from "../models/TaskBD";

type CourseDialogContextType = {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
  removeRequirement: (id: number) => void;
  updateRequirement: (id: number, field: string, val: any) => void;
  addEmptyRequirement: () => void;
  removeTask: (id: number) => void;
  updateTask: (id: number, field: string, val: any) => void;
  addEmptyTask: () => void;
  variant: CourseDialogVariantType;
  updateCourseReqTas: (course: Course) => void;
  closeDialog: () => void; // Add closeDialog function
};

export type CourseDialogVariantType = "new" | "edit";

const CourseDialogContext = createContext<CourseDialogContextType>(
  {} as CourseDialogContextType
);


export const useCourseDialogContext = () => useContext(CourseDialogContext);

export const CourseDialogContextProvider = ({
  children,
  course: initCourse,
  variant,
}: {
  children: React.ReactNode;
  course: Course;
  variant: CourseDialogVariantType;
}) => {
  const [course, setCourse] = useState(initCourse);
  const [isDialogOpen, setDialogOpen] = useState(true); // State to manage dialog open/close

  useEffect(() => {
    console.log(course);
  }, [course]);

  const taskTypeMapping = {
    "Laboratorium": 1,
    "Projekt": 2,
  };
  
  const requirementTypeMapping = {
    "Total": 1,
    "Separately": 2,
  };
  
  const thresholdTypeMapping = {
    "Points": 1,
    "Percent": 2,
  };

  const convertRequirementToRequirementBD = (requirement: Requirement) => {
    return {
      task_type: taskTypeMapping[requirement.task_type],
      requirement_type: requirementTypeMapping[requirement.requirement_type],
      threshold: requirement.threshold,
      threshold_type: thresholdTypeMapping[requirement.threshold_type],
    };
  };
  
  const convertTaskToTaskBD = (task: Task) => {
    return {
      max_points: task.max_points,
      points: task.result === null ? 0 : task.result,
      deadline: task.deadline,
      task_type: taskTypeMapping[task.task_type],
      description: task.description,
    };
  };

  const updateCourseReqTas = async (course: Course) => {
    try {
      // Fetch updated requirements and tasks data from your course state
      const { id, requirements, tasks } = course;

      const requirementsBD = [];
      for (const req of requirements) {
        const convertedReq = convertRequirementToRequirementBD(req);
        requirementsBD.push(convertedReq);
      }

      const tasksBD = [];
      for (const task of tasks) {
        const convertedTask = convertTaskToTaskBD(task);
        tasksBD.push(convertedTask);
      }
  
      // Make PUT request to update requirements
      await fetch(`http://localhost:8080/api/v1/subjects/${id}/requirements`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requirementsBD),
      });
  
      // Make PUT request to update tasks
      await fetch(`http://localhost:8080/api/v1/subjects/${id}/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasksBD),
      });
  
      console.log("Requirements and tasks updated successfully");
    } catch (error) {
      console.error("Error updating requirements and tasks:", error);
      // Handle error if needed
    }
  };

  const closeDialog = (): void => {
    setDialogOpen(false);
  };

  const removeRequirement = (id: number): void => {
    setCourse((prev) => {
      const filteredRequirements = prev.requirements.filter(
        (_, idx) => id !== idx
      );
      const newCourse: Course = {
        ...course,
        requirements: filteredRequirements,
      };
      return newCourse;
    });
  };

  const updateRequirement = (id: number, field: string, val: any): void => {
    const updatedReq = course.requirements.find(
      (_, idx) => id === idx
    )! as any;
    updatedReq[field] = val;
    setCourse((prev) => ({ ...prev }));
  };

  const addEmptyRequirement = (): void => {
    const newRequirement: Requirement = {
      task_type: "Laboratorium",
      requirement_type: "Total",
      threshold: 0,
      threshold_type: "Points",
    };
    const requirements = [...course.requirements, newRequirement];
    setCourse((prev) => ({ ...prev, requirements }));
  };

  const removeTask = (id: number): void => {
    setCourse((prev) => {
      const filteredTasks = prev.tasks.filter((_, idx) => id !== idx);
      const newCourse: Course = {
        ...course,
        tasks: filteredTasks,
      };
      return newCourse;
    });
  };

  const updateTask = (id: number, field: string, val: any): void => {
    const updatedTask = course.tasks.find((_, idx) => id === idx)! as any;
    updatedTask[field] = val;
    setCourse((prev) => ({ ...prev }));
  };

  const addEmptyTask = (): void => {
    const newTask: Task = {
      max_points: 0,
      result: null,
      deadline: new Date(),
      task_type: "Laboratorium",
      description: "",
    };
    const tasks = [...course.tasks, newTask];
    setCourse((prev) => ({ ...prev, tasks }));
  };

  return (
    <CourseDialogContext.Provider
      value={{
        course,
        setCourse,
        removeRequirement,
        updateRequirement,
        addEmptyRequirement,
        removeTask,
        updateTask,
        addEmptyTask,
        variant,
        updateCourseReqTas,
        closeDialog,
      }}
    >
      {isDialogOpen && children} {/* Render children only when dialog is open */}
    </CourseDialogContext.Provider>
  );
};
