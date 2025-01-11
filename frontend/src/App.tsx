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



/*
import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/common/Loading";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const Home = lazy(() => import("./pages/Home"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Chat = lazy(() => import("./pages/Chat"));
const Courses = lazy(() => import("./pages/Courses"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

interface SuspenseWrapperProps {
  LazyComponent: React.LazyExoticComponent<() => JSX.Element>;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ LazyComponent }) => {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
};

interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  protected: boolean;
}

const routes: RouteConfig[] = [
  { path: "/", component: Home, protected: false },
  { path: "/calendar", component: Calendar, protected: true },
  { path: "/chat", component: Chat, protected: true },
  { path: "/courses", component: Courses, protected: true },
  { path: "/login", component: Login, protected: false },
  { path: "*", component: NotFound, protected: false },
];

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, path, ...rest }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? (
    <Route {...rest} path={path} element={<Component />} />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, id) => (
            <Route
              key={id}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute path={route.path} component={() => <SuspenseWrapper LazyComponent={route.component} />} />
                ) : (
                  <SuspenseWrapper LazyComponent={route.component} />
                )
              }
            />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
*/