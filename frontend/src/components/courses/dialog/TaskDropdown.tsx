import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useCourseDialogContext } from "../../../contexts/CourseDialogContext";
import { MdKeyboardArrowDown } from "react-icons/md";

export type PossibleValueType = {
  label: string;
  value: string;
};

export default function TaskDropdown({
  initValue,
  possibleValues,
  title,
  field,
  id,
}: {
  initValue: PossibleValueType;
  possibleValues: PossibleValueType[];
  title: string;
  field: string;
  id: number;
}) {
  const { updateTask } = useCourseDialogContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <button className="rounded-sm border-2 border-slate-200 hover:bg-slate-100 mr-8 my-2 px-4 py-2 w-48 flex justify-between items-center text-sm">
          {initValue.label}
          <MdKeyboardArrowDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {possibleValues.map(({ label, value }, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => updateTask(id, field, value)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
