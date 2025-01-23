import React from "react";
import { Input } from "../../ui/input";
import { useCourseDialogContext } from "../../../contexts/CourseDialogContext";


const apiUrl = process.env.REACT_APP_SERVER_URL;

export default function CourseDialogName() {
  const { course, setCourse } = useCourseDialogContext();

  const handleColorChange = async (color: string) => {
    try {
      await fetch(`${apiUrl}/api/v1/subjects/${course.id}/accent-color`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(color)
      });
      setCourse((prev) => ({
        ...prev,
        accent_color: color
      }));
    } catch (error) {
      console.error('Failed to update color:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-4 my-8">
      <p>Subject name</p>
      <p>Subject color</p>
      <Input
        defaultValue={course.name}
        onChange={(e) =>
          setCourse((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Input
        type="color"
        className="w-12 px-2 py-1 aspect-square"
        defaultValue={course.accent_color}
        onChange={(e) => handleColorChange(e.target.value)}
      />
    </div>
  );
}
