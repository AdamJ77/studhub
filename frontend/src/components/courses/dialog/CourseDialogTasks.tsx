import { useCourseDialogContext } from "../../../contexts/CourseDialogContext";
import React from "react";
import { PossibleValueType } from "./RequirementDropdown";
import { Input } from "../../ui/input";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import TaskDropdown from "./TaskDropdown";

export default function CourseDialogTasks() {
  const { course, removeTask, updateTask, addEmptyTask } =
    useCourseDialogContext();

  const taskTypesValues: PossibleValueType[] = [
    {
      label: "Laboratorium",
      value: "Laboratorium",
    },
    {
      label: "Projekt",
      value: "Projekt",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="font-semibold">Zaliczenia</h3>
      <div>
        {course.tasks.map((task, id) => (
          <div key={id} className="flex w-full">
            <TaskDropdown
              initValue={
                taskTypesValues.find(({ value }) => value === task.task_type)!
              }
              possibleValues={taskTypesValues}
              title="Typ Zadania"
              field="task_type"
              id={id}
            />
            <Input
              defaultValue={task.description}
              className="mt-2 border-2 border-slate-200 mr-8"
              onChange={(e) => updateTask(id, "description", e.target.value)}
            />
            <Input
              type="number"
              defaultValue={task.result || 0}
              className="mt-2 border-2 border-slate-200 mr-4"
              onChange={(e) =>
                updateTask(id, "result", parseInt(e.target.value))
              }
            />
            <p className="pt-4">/</p>
            <Input
              type="number"
              defaultValue={task.max_points}
              className="mt-2 border-2 border-slate-200 mr-8 ml-4"
              onChange={(e) =>
                updateTask(id, "max_points", parseInt(e.target.value))
              }
            />
            <Input
              type="date"
              defaultValue={task.deadline.toISOString().split("T")[0]}
              className="mt-2 border-2 border-slate-200 mr-8"
              onChange={(e) =>
                updateTask(id, "deadline", new Date(e.target.value))
              }
            />

            <button
              className="border-2 border-red-500 text-red-500 my-2 px-4 rounded-sm hover:bg-red-200"
              onClick={() => removeTask(id)}
            >
              <IoTrashOutline />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addEmptyTask}
        className="border-2 border-blue-500 text-blue-500 rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-200 mt-2 gap-4 text-sm"
      >
        <FaPlus />
        Dodaj zaliczenie
      </button>
    </div>
  );
}
