import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/common/Loading";

function App() {
  const Home = lazy(() => import("./pages/Home"));
  const Calendar = lazy(() => import("./pages/Calendar"));
  const Chat = lazy(() => import("./pages/Chat"));
  const Courses = lazy(() => import("./pages/Courses"));
  const Login = lazy(() => import("./pages/Login"));
  const NotFound = lazy(() => import("./pages/NotFound"));

  const SuspenseWrapper = ({
    lazyComponent,
  }: {
    lazyComponent: React.LazyExoticComponent<() => JSX.Element>;
  }) => {
    return (
      <Suspense fallback={<Loading />}>
        {React.createElement(lazyComponent)}
      </Suspense>
    );
  };

  const routes = [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/calendar",
      component: Calendar,
    },
    {
      path: "/chat",
      component: Chat,
    },
    {
      path: "/courses",
      component: Courses,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "*",
      component: NotFound,
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route, id) => (
          <Route
            key={id}
            path={route.path}
            element={<SuspenseWrapper lazyComponent={route.component} />}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
