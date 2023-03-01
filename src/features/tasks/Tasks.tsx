import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  fetchTasksAsync,
  selectAllTasks,
  selectTasksRequiredReload,
} from "./tasksSlice";
import { type Task } from "./tasksSlice";
import { ROUTES } from "../../routes/routes";
import { useLocation, useNavigate } from "react-router-dom";

const TaskItem: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <li
      key={index}
      className="d-flex justify-content-start"
      style={{
        width: "100%",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          width: "100%",
        }}
      >
        <div className="d-flex align-items-center">
          <span>{index + 1}.</span>
          <Button
            variant="link"
            onClick={() => navigate(`${pathname}/${task.id}`)}
          >
            {task.title}
          </Button>
        </div>
        {task?.Member && (
          <div>
            <Button
              variant="link"
              onClick={() => navigate(`${ROUTES.MEMBERS}/${task.memberId}`)}
            >
              {task.Member.name}
            </Button>
          </div>
        )}
      </div>
    </li>
  );
};

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

  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, []);

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
      </div>
      <div
        style={{
          width: "50%",
        }}
      >
        <ul>
          {tasks &&
            tasks.map(
              (task, index) =>
                task && <TaskItem key={index} task={task} index={index} />
            )}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;
