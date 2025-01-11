import React, { createContext, useContext, useState } from "react";
import { Course } from "../models/Course";

type CoursesContextType = {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  updateCourse: (id: string, newCourse: Course) => void;
};

const CoursesContext = createContext<CoursesContextType>(
  {} as CoursesContextType
);

export const useCoursesContext = () => useContext(CoursesContext);

export const CoursesContextProvider = ({
  children,
  courses: initCourses,
}: {
  children: React.ReactNode;
  courses: Course[];
}) => {
  const [courses, setCourses] = useState(initCourses);

  const updateCourse = (id: string, newCourse: Course): void => {
    setCourses((prev) => {
      const idx = prev.findIndex((course) => course.id === id);
      const updatedCourses = [
        ...prev.slice(0, idx),
        newCourse,
        ...prev.slice(idx + 1),
      ];
      return updatedCourses;
    });
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        setCourses,
        updateCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
