import { Course } from "@/src/models/Course";
import React from "react";
import CourseAccordionTasks from "./CourseAccordionTasks";
import CoursesAccordionRequirements from "./CoursesAccordionRequirements";
import CoursesButtons from "./CoursesButtons";

export default function CoursesAccordionContent({
  course,
}: {
  course: Course;
}) {
  return (
    <div className="py-4 px-8">
      <CourseAccordionTasks tasks={course.tasks} />
      <CoursesAccordionRequirements
        requirements={course.requirements}
        tasks={course.tasks}
      />
      <CoursesButtons course={course} />
    </div>
  );
}
