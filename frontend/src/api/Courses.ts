import { Course } from "../models/Course";

export const coursesFakeData: Course[] = [
  {
    id: "2",
    name: "Systemy Operacyjne",
    appearance: {
      background_color: "#FF0000",
    },
    tasks: [
      {
        max_points: 10,
        result: 4,
        deadline: new Date("2022-12-01"),
        task_type: "Laboratorium",
        description: "Semafory",
      },
      {
        max_points: 10,
        result: 6,
        deadline: new Date("2022-12-02"),
        task_type: "Laboratorium",
        description: "Monitory",
      },
      {
        max_points: 20,
        result: null,
        deadline: new Date("2022-12-03"),
        task_type: "Laboratorium",
        description: "Szeregowanie",
      },
      {
        max_points: 0,
        result: null,
        deadline: new Date("2022-12-04"),
        task_type: "Laboratorium",
        description: "Wstęp",
      },
    ],
    requirements: [
      {
        task_type: "Laboratorium",
        requirement_type: "Total",
        threshold: 5,
        threshold_type: "Points",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Total",
        threshold: 50,
        threshold_type: "Percent",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Separately",
        threshold: 4,
        threshold_type: "Points",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Separately",
        threshold: 40,
        threshold_type: "Percent",
      },
    ],
  },
  {
    id: "1",
    name: "Probabilistyka",
    appearance: {
      background_color: "#123456",
    },
    tasks: [
      {
        max_points: 10,
        result: 4,
        deadline: new Date("2022-12-01"),
        task_type: "Projekt",
        description: "Projekt Semafory",
      },
      {
        max_points: 10,
        result: 4,
        deadline: new Date("2022-12-01"),
        task_type: "Laboratorium",
        description: "Semafory",
      },
      {
        max_points: 10,
        result: 6,
        deadline: new Date("2022-12-02"),
        task_type: "Laboratorium",
        description: "Monitory",
      },
      {
        max_points: 20,
        result: null,
        deadline: new Date("2022-12-03"),
        task_type: "Laboratorium",
        description: "Szeregowanie",
      },
      {
        max_points: 0,
        result: null,
        deadline: new Date("2022-12-04"),
        task_type: "Laboratorium",
        description: "Wstęp",
      },
    ],
    requirements: [
      {
        task_type: "Laboratorium",
        requirement_type: "Total",
        threshold: 5,
        threshold_type: "Points",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Total",
        threshold: 50,
        threshold_type: "Percent",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Separately",
        threshold: 4,
        threshold_type: "Points",
      },
      {
        task_type: "Laboratorium",
        requirement_type: "Separately",
        threshold: 40,
        threshold_type: "Percent",
      },
    ],
  },
];
