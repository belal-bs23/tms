import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchTasksAsync, selectAllTasks } from "./tasksSlice";
import styles from "./Counter.module.css";

function Tasks() {
  const tasks = useAppSelector(selectAllTasks);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Welcome to tasks page!</h1>
    </div>
  );
}

export default Tasks;
