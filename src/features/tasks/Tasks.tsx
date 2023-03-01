import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  fetchTasksAsync,
  selectAllTasks,
  selectTasksRequiredReload,
} from "./tasksSlice";
import { ROUTES } from "../../routes/routes";
import { useLocation, useNavigate } from "react-router-dom";

function Tasks() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const tasksRequiredReload = useAppSelector(selectTasksRequiredReload);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (tasksRequiredReload) {
      dispatch(fetchTasksAsync());
    }
  }, [tasksRequiredReload, dispatch]);

  return (
    <div>
      <div>
        <h2>All tasks</h2>
        <p>You will find all tasks here.</p>
      </div>
      <br />
      <div className="d-flex justify-content-start align-items-center">
        <h3>Here is all tasks:</h3>
        <div className="mx-5">
          <Button
            onClick={() => {
              navigate(`${pathname}/${ROUTES.ADD_TASK}`);
            }}
            className="btn-sm"
            variant="secondary"
          >
            Add new
          </Button>
        </div>
        {/* <div className="mx-5">
          <Button
            onClick={() => {
              dispatch(fetchTasksAsync());
            }}
            className="btn-sm"
            variant="secondary"
          >
            Refresh
          </Button>
        </div> */}
      </div>
      <div>
        <ul>
          {tasks &&
            tasks.map(
              (task, index) => task && <li key={index}>{task.title}</li>
            )}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;
