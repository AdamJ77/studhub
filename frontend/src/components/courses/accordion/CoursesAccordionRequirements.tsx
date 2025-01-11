import { Requirement } from "@/src/models/Requirement";
import React from "react";
import CoursesAccordionRequirement from "./CoursesAccordionRequirement";
import { Task } from "@/src/models/Task";

export default function CoursesAccordionRequirements({
  requirements,
  tasks,
}: {
  requirements: Requirement[];
  tasks: Task[];
}) {
  return (
    <div>
      <h2 className="text-center font-semibold text-2xl p-4">Requirements</h2>
      <div className="grid grid-cols-1 w-full rounded-md border-2 border-slate-200">
        {requirements.map((requirement, id) => (
          <React.Fragment key={id}>
            {id !== 0 && (
              <div className="bg-slate-300" style={{ height: "1px" }} />
            )}
            <CoursesAccordionRequirement
              requirement={requirement}
              tasks={tasks}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
