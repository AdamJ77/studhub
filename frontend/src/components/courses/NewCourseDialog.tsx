import React from "react";
import CourseDialog from "./dialog/CourseDialog";
import { Course } from "../../models/Course";
import { v4 as uuidv4 } from "uuid";

export default function NewCourseDialog() {
  const emptyCourse: Course = {
    id: uuidv4(),
    name: "",
    appearance: {
      background_color: "#FFFFFF",
    },
    tasks: [],
    requirements: [],
  };

  return (
    <div className="flex justify-center mb-8">
      <CourseDialog course={emptyCourse} variant="new">
        <button className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
         Add new course
        </button>
      </CourseDialog>
    </div>
  );
}
