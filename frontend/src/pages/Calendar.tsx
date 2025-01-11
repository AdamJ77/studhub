import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Course } from "../models/Course";
import { Task, TaskType } from "../models/Task";
import { TaskBD } from "../models/TaskBD";
import axios from 'axios';

const fetchSubjects = async (): Promise<Course[]> => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/subjects', {
      withCredentials: true
    });
    return response.data.map((subject: any) => ({
      name: subject.name,
      appearance: {
        background_color: "#FF0000",
      },
      tasks: convertTasksBDToTasks(subject.tasks) || []
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        throw new Error('Unauthorized: No current user');
      }
    }
    throw new Error('Failed to fetch subjects');
  }
};

const reverseTaskTypeMapping: { [key: number]: TaskType } = {
  1: "Laboratorium",
  2: "Projekt",
};

const convertTaskBDToTask = (taskBD: any) => {
  return {
    max_points: parseInt(taskBD.max_points),
    result: taskBD.points === 0 ? null : taskBD.points,
    deadline: new Date(taskBD.deadline),
    task_type: reverseTaskTypeMapping[taskBD.task_type],
    description: taskBD.description,
  };
};

const convertTasksBDToTasks = (TaskBD: TaskBD[]): Task[] => {
  return TaskBD.map(convertTaskBDToTask);
};

export default function Calendar() {
  const [subjects, setSubjects] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Course[]>([]);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const subject_temp = await fetchSubjects();
        setSubjects(subject_temp);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    getSubjects();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isEqual = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(nextMonth(currentMonth));
  };

  const prevMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  };

  const nextMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const subjectsOnSelectedDate = subjects.filter((subj) =>
      subj.tasks.some((event) => isEqual(event.deadline, date))
    );
    setSelectedSubjects(subjectsOnSelectedDate);
  };

  const renderCalendar = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const monthStartDay = firstDayOfMonth.getDay();
    const calendar = [];

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < daysOfWeek.length; i++) {
      calendar.push(
        <div key={daysOfWeek[i]} style={{ padding: "10px", textAlign: "center" }}>
          {daysOfWeek[i]}
        </div>
      );
    }

    // previous month's days
    for (let i = monthStartDay - 1; i > 0; i--) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - i);
      calendar.push(
        <div
          key={`prev-${prevDate.getDate()}`}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            margin: "2px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px"
          }}
        >
          {prevDate.getDate()}
        </div>
      );
    }

    // current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
      const subjectsOnDate = subjects.filter((subj) =>
        subj.tasks.some((event: { deadline: Date; }) => isEqual(event.deadline, currentDate))
      );

      const subjectElements =
        subjectsOnDate.length <= 2 ? (
          subjectsOnDate.map((subj, index) => (
            <div key={index}>{subj.name}</div>
          ))
        ) : (
          <div>{subjectsOnDate.length} subjects</div>
        );

      calendar.push(
        <div
          key={i}
          onClick={() => handleDateClick(currentDate)}
          style={{
            width: "110px",
            height: "80px",
            cursor: "pointer",
            border: "1px solid #ccc",
            margin: "2px",
            borderRadius: "8px",
            backgroundColor: isEqual(currentDate, new Date()) ? "#4caf50" : "#007bff",
            color: "white",
            position: "relative",
            textAlign: "center"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isEqual(currentDate, new Date()) ? "#388e3c" : "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isEqual(currentDate, new Date()) ? "#4caf50" : "#007bff")}
        >
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", top: "5px", left: "5px" }}>{i}</span>
            <div style={{ position: "absolute", top: "25px", left: "5px", textAlign: "left" }}>{subjectElements}</div>
          </div>
        </div>
      );
    }

    // next month's days
    const remainingDays = (7 - ((monthStartDay === 0 ? 7 : monthStartDay) + daysInMonth) % 7 + 1) % 7;
    if (remainingDays !== 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(lastDayOfMonth);
        nextDate.setDate(lastDayOfMonth.getDate() + i);
        calendar.push(
          <div
            key={`next-${nextDate.getDate()}`}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              margin: "2px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px"
            }}
          >
            {nextDate.getDate()}
          </div>
        );
      }
    }

    return calendar;
  };

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <button onClick={handlePrevMonth} style={{ padding: "10px", backgroundColor: "#7e8687", borderRadius: "8px", border: "none", cursor: "pointer" }}>Previous Month</button>
          <div style={{ backgroundColor: "#333", padding: "10px", borderRadius: "5px" }}>
            <h2 style={{ margin: "0 20px", color: "#fff" }}>
              {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
          </div>
          <button onClick={handleNextMonth} style={{ padding: "10px", backgroundColor: "#7e8687", borderRadius: "8px", border: "none", cursor: "pointer" }}>Next Month</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 110px)", gap: "5px" }}>
          {renderCalendar(currentMonth)}
        </div>
        {selectedDate && (
          <div style={{ marginTop: "20px" }}>
            <strong>Selected Date:</strong> {selectedDate.toDateString()}
            {selectedSubjects.length > 0 && (
              <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
                <h4>Events on Selected Date:</h4>
                {selectedSubjects.flatMap((subject) =>
                  subject.tasks.filter((event: { deadline: Date; }) => isEqual(event.deadline, selectedDate)).map((event: { task_type: string; }, eventIndex: React.Key | null | undefined) => (
                    <div key={eventIndex} style={{ marginBottom: "10px" }}>
                      <div style={{ width: "20px", height: "20px", backgroundColor: subject.appearance.background_color, marginRight: "10px", display: "inline-block" }}></div>
                      <span>{subject.name} - {event.task_type}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
