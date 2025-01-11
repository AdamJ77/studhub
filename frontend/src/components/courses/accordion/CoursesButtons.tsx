import { Course } from "../../../models/Course";
import React from "react";
import CourseDialog from "../dialog/CourseDialog";
import { useCoursesContext } from "../../../contexts/CoursesContext";

export default function CoursesButtons({ course }: { course: Course }) {
  
  return (
    <div className="my-4 float-end flex gap-4">
      <CourseDialog course={course} variant="edit">
        <button className="px-4 py-2 text-blue-500 border-2 border-blue-500 rounded-sm hover:bg-blue-200">
          Edit
        </button>
      </CourseDialog>
    </div>
  );
}
