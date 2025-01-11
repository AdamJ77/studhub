import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import CourseAccordionTrigger from "./CourseAccordionTrigger";
import CoursesAccordionContent from "./CoursesAccordionContent";
import { useCoursesContext } from "../../../contexts/CoursesContext";

export default function CoursesAccordion() {
  const { courses } = useCoursesContext();

  return (
    <Accordion
      type="single"
      collapsible
      className="w-1/2 mx-auto my-10 border-2 border-slate-200 rounded-lg"
    >
      {courses.map((course, id) => (
        <AccordionItem value={course.id} key={id} className="w-full">
          <AccordionTrigger className="bg-slate-100 px-2 rounded-sm">
            <CourseAccordionTrigger course={course} />
          </AccordionTrigger>
          <AccordionContent>
            <CoursesAccordionContent course={course} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
