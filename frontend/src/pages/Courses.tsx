import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CoursesAccordion from "../components/courses/accordion/CoursesAccordion";
import { CoursesContextProvider } from "../contexts/CoursesContext";
import { Course } from "../models/Course";
import { Requirement } from "../models/Requirement";
import { RequirementBD } from "../models/RequirementBD";
import { Task, TaskType } from "../models/Task";
import { TaskBD } from "../models/TaskBD";
import axios from 'axios';


const fetchSubjects = async (): Promise<Course[]> => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/subjects', {
      withCredentials: true
    });
    return response.data.map((subject: any) => ({
      id: subject.id,
      name: subject.name,
      appearance: {
        background_color: "#FF0000",
      },
      tasks: convertTasksBDToTasks(subject.tasks) || [],
      requirements: convertRequirementsBDToRequirements(subject.requirements) || []
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: No current user');
      }
    }
    throw new Error('Failed to fetch subjects');
  }
};

const reverseTaskTypeMapping: { [key: number]: TaskType } = {
  1: "Laboratorium",
  2: "Projekt",
};

const reverseRequirementTypeMapping: { [key: number]: "Total" | "Separately" } = {
  1: "Total",
  2: "Separately",
};

const reverseThresholdTypeMapping: { [key: number]: "Points" | "Percent" } = {
  1: "Points",
  2: "Percent",
};

// Reverse conversion for RequirementBD to Requirement
const convertRequirementBDToRequirement = (requirementBD: any) => {
  return {
    task_type: reverseTaskTypeMapping[requirementBD.task_type],
    requirement_type: reverseRequirementTypeMapping[requirementBD.requirement_type],
    threshold: parseInt(requirementBD.threshold),
    threshold_type: reverseThresholdTypeMapping[requirementBD.threshold_type],
  };
};

const convertRequirementsBDToRequirements = (requirementsBD: RequirementBD[]): Requirement[] => {
  return requirementsBD.map(convertRequirementBDToRequirement);
};

// Reverse conversion for TaskBD to Task
const convertTaskBDToTask = (taskBD: any) => {
  return {
    max_points: parseInt(taskBD.max_points),
    result: taskBD.points === 0 ? null : taskBD.points,
    deadline: new Date(taskBD.deadline),
    task_type: reverseTaskTypeMapping[taskBD.task_type],
    description: taskBD.description,
  };
};

const convertTasksBDToTasks = (TaskBD: TaskBD[]): Task[] => {
  return TaskBD.map(convertTaskBDToTask);
};


// Courses component
export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const subjects = await fetchSubjects();
        setCourses(subjects);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CoursesContextProvider courses={courses}>
      <Navbar />
      <CoursesAccordion />
      <Footer />
    </CoursesContextProvider>
  );
}