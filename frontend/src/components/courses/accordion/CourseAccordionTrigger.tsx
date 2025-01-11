import { Course } from "@/src/models/Course";
import React from "react";

export default function CourseAccordionTrigger({
  course,
}: {
  course: Course;
}) {
  return (
    <div className="flex items-center justify-between w-full px-4">
      <div className="flex gap-4 items-center">
        <div
          style={{ backgroundColor: course.appearance.background_color }}
          className="w-4 h-4 aspect-square rounded-sm"
        />
        <p>{course.name}</p>
      </div>
      <div className="bg-slate-500 text-white px-2 rounded-full text-sm text-nowrap">In progress</div>
    </div>
  );
}
