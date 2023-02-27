import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import PrivateLayout from "../components/ui/PrivateLayout";
import PublicLayout from "../components/ui/PublicLayout";
import Home from "../pages/home/Home";
import Signin from "../pages/signin/Signin";
import Signup from "../pages/signup/Signup";
import TasksLayout from "../pages/tasks/TasksLayout";
import Tasks from "../pages/tasks/Tasks";
import TaskDetail from "../pages/tasks/TaskDetail";
import AddTask from "../pages/tasks/AddTask";
import MembersLayout from "../pages/members/MembersLayout";
import Members from "../pages/members/Members";
import MemberDetail from "../pages/members/MemberDetail";
import AddMember from "../pages/members/AddMember";

function RootRouter() {
  const isLoogedIn = true;

  return isLoogedIn ? (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME_PRIVATE} element={<PrivateLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.TASKS} element={<TasksLayout />}>
            <Route index element={<Tasks />} />
            <Route path={ROUTES.ADD_TASK} element={<AddTask />} />
            <Route path=":id" element={<TaskDetail />} />
          </Route>
          <Route path={ROUTES.MEMBERS} element={<MembersLayout />}>
            <Route index element={<Members />} />
            <Route path={ROUTES.ADD_MEMBER} element={<AddMember />} />
            <Route path=":id" element={<MemberDetail />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  ) : (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME_PUBLIC} element={<PublicLayout />}>
          <Route index element={<Signin />} />
          <Route path={ROUTES.SIGNIN} element={<Signin />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RootRouter;
