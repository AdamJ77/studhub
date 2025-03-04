import { useCourseDialogContext } from "../../../contexts/CourseDialogContext";
import React from "react";
import RequirementDropdown, { PossibleValueType } from "./RequirementDropdown";
import { Input } from "../../ui/input";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

export default function CourseDialogRequirements() {
  const { course, removeRequirement, updateRequirement, addEmptyRequirement } =
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

  const thresholdTypesValues: PossibleValueType[] = [
    {
      label: "Points",
      value: "Points",
    },
    {
      label: "Percent",
      value: "Percent",
    },
  ];

  const requirementTypesValues: PossibleValueType[] = [
    {
      label: "Total",
      value: "Total",
    },
    {
      label: "Separately",
      value: "Separately",
    },
  ];

  return (
    <div>
      <h3 className="font-semibold">Subject completion requirements</h3>
      <div>
        {course.requirements.map((requirement, id) => (
          <div key={id} className="flex w-full">
            <RequirementDropdown
              initValue={
                taskTypesValues.find(
                  ({ value }) => value === requirement.task_type
                )!
              }
              possibleValues={taskTypesValues}
              title="Task type"
              field="task_type"
              id={id}
            />
            <Input
              type="number"
              defaultValue={requirement.threshold}
              className="mt-2 border-2 border-slate-200 mr-8"
              onChange={(e) =>
                updateRequirement(id, "threshold", parseInt(e.target.value))
              }
            />
            <RequirementDropdown
              initValue={
                thresholdTypesValues.find(
                  ({ value }) => value === requirement.threshold_type
                )!
              }
              possibleValues={thresholdTypesValues}
              title="Threshold type"
              field="threshold_type"
              id={id}
            />
            <RequirementDropdown
              initValue={
                requirementTypesValues.find(
                  ({ value }) => value === requirement.requirement_type
                )!
              }
              possibleValues={requirementTypesValues}
              title="Requirement type"
              field="requirement_type"
              id={id}
            />
            <button
              className="border-2 border-red-500 text-red-500 my-2 px-4 rounded-sm hover:bg-red-200"
              onClick={() => removeRequirement(id)}
            >
              <IoTrashOutline />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addEmptyRequirement}
        className="border-2 border-blue-500 text-blue-500 rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-200 mt-2 gap-4 text-sm"
      >
        <FaPlus />
        Add completion requirement
      </button>
    </div>
  );
}
