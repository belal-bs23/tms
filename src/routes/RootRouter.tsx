import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import PrivateLayout from "../components/ui/PrivateLayout";
import PublicLayout from "../components/ui/PublicLayout";
import HomePrivate from "../features/home/HomePrivate";
import HomePublic from "../features/home/HomePublic";
import Signin from "../features/auth/Signin";
import Signup from "../features/auth/Signup";
import TasksLayout from "../features/tasks/TasksLayout";
import Tasks from "../features/tasks/Tasks";
import TaskDetail from "../features/tasks/TaskDetail";
import AddTask from "../features/tasks/AddTask";
import MembersLayout from "../features/members/MembersLayout";
import Members from "../features/members/Members";
import MemberDetail from "../features/members/MemberDetail";
import AddMember from "../features/members/AddMember";

function RootRouter() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<PrivateLayout />}>
          <Route index element={<HomePrivate />} />
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
          <Route path={ROUTES.AUTH} element={<PublicLayout />}>
            <Route index element={<HomePublic />} />
            <Route path={ROUTES.SIGNIN} element={<Signin />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default RootRouter;
