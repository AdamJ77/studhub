import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Course } from "@/src/models/Course";
import {
  CourseDialogContextProvider,
  CourseDialogVariantType,
} from "../../../contexts/CourseDialogContext";
import CourseDialogName from "./CourseDialogName";
import CourseDialogRequirements from "./CourseDialogRequirements";
import CourseDialogTasks from "./CourseDialogTasks";
import CourseDialogFooter from "./CourseDialogFooter";

export default function CourseDialog({
  children,
  course,
  variant,
}: {
  children: React.ReactNode;
  course: Course;
  variant: CourseDialogVariantType;
}) {
  const title =
    variant === "new" ? "Dodawanie przedmiotu" : "Edytowanie przedmiotu";

  return (
    <CourseDialogContextProvider course={course} variant={variant}>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[1200px] mt-8">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 px-4 max-h-[700px] overflow-auto hide-scrollbar">
            <CourseDialogName />
            <CourseDialogRequirements />
            <CourseDialogTasks />
          </div>
          <DialogFooter className="sm:justify-start">
            <CourseDialogFooter />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CourseDialogContextProvider>
  );
}
