import { Task } from "@/src/models/Task";
import React from "react";

export default function CourseAccordionTasks({ tasks }: { tasks: Task[] }) {
  const filteredTasks = [
    {
      title: "Laboratorium",
      tasks: tasks.filter((task) => task.task_type === "Laboratorium"),
    },
    {
      title: "Projekt",
      tasks: tasks.filter((task) => task.task_type === "Projekt"),
    },
  ].filter(({ tasks }) => tasks.length > 0);

  return (
    <div>
      {filteredTasks.map(({ title, tasks }, id) => (
        <React.Fragment key={id}>
          <h2 className="text-2xl font-semibold text-center py-4">{title}</h2>
          <div className="grid grid-cols-1 w-full border-2 border-slate-200 rounded-md">
            {tasks.map((task, id) => (
              <div
                key={id}
                className={`flex items-center justify-between p-4 ${
                  id !== 0 ? "border-t border-slate-200" : ""
                }`}
              >
                <div>
                  {id + 1}.{" "}
                  <span className="font-bold">{task.description}</span>
                </div>
                {task.result === null ? (
                  <div className="bg-slate-400 text-white rounded-full px-2 font-semibold">
                    -/{task.max_points}
                  </div>
                ) : (
                  <div className="bg-blue-500 text-white rounded-full px-2 font-semibold">
                    {task.result}/{task.max_points}
                  </div>
                )}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
