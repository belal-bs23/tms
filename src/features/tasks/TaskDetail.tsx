import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ROUTES } from "../../routes/routes";
import {
  selectTaskById,
  deleteTaskAsync,
  selectTaskStatusById,
  resetTaskRequiredReloadById,
  resetTasks,
} from "./tasksSlice";
function TaskDetail() {
  const params = useParams();
  const taskId = params?.id ? Number(params?.id) : NaN;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const task = useAppSelector((state) => selectTaskById(state, taskId));
  const taskStatus = useAppSelector((state) =>
    selectTaskStatusById(state, taskId)
  );

  const [loading, setLoading] = useState(false);

  const handleOnClickDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      console.log("Deleting");
      dispatch(deleteTaskAsync({ id }));
    } else {
      console.log("Canceling delete.");
    }
  };

  useEffect(() => {
    dispatch(resetTaskRequiredReloadById(taskId));
  }, []);

  useEffect(() => {
    if (taskStatus === "deleting") {
      setLoading(true);
    } else if (taskStatus === "deleted") {
      setLoading(false);
      dispatch(resetTasks());
      navigate(ROUTES.TASKS);
    } else if (taskStatus === "failed") {
      alert("Task deletion failed");
    }
  }, [taskStatus]);

  return task ? (
    <div>
      {loading && <Spinner />}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Button
            variant="link"
            className="btn-sm"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div
            style={{
              width: "50px",
            }}
          >
            <Button
              variant="secondary"
              className="btn-sm"
              onClick={() => {
                navigate(`${pathname}/${ROUTES.EDIT_TASK}`);
              }}
            >
              Edit
            </Button>
          </div>
          <div
            style={{
              width: "50px",
              marginLeft: "5px",
            }}
          >
            <Button
              variant="secondary"
              className="btn-sm"
              onClick={() => handleOnClickDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <br />
      <div>
        <h3>Title: {task.title}</h3>
        <p>Description: {task.description}</p>
        {task.Member && (
          <div>
            <p>Assigned to: {task.Member.name}</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>
      <h3 className="text-warning text-center">Task does not exist!</h3>
      <div>
        <Button
          variant="link"
          className="btn-sm"
          onClick={() => {
            navigate(ROUTES.TASKS);
          }}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default TaskDetail;
