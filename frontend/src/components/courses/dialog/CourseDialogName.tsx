import React from "react";
import { Input } from "../../ui/input";
import { useCourseDialogContext } from "../../../contexts/CourseDialogContext";

export default function CourseDialogName() {
  const { course, setCourse } = useCourseDialogContext();

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-4 my-8">
      <p>Nazwa przedmiotu</p>
      <p>Kolor przedmiotu</p>
      <Input
        defaultValue={course.name}
        onChange={(e) =>
          setCourse((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Input
        type="color"
        className="w-12 px-2 py-1 aspect-square"
        defaultValue={course.appearance.background_color}
        onChange={(e) =>
          setCourse((prev) => ({
            ...prev,
            appearance: { background_color: e.target.value },
          }))
        }
      />
    </div>
  );
}
