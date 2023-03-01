import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTaskById, resetTaskStateById } from "./tasksSlice";

import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import TaskForm from "./TaskForm";

function EditTask() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const taskId = params?.id ? Number(params?.id) : NaN;
  const navigate = useNavigate();

  const task = useAppSelector((state) => selectTaskById(state, taskId));

  useEffect(() => {
    if (taskId) {
      dispatch(resetTaskStateById(taskId));
    }
  }, []);

  return task ? (
    <TaskForm task={task} />
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

export default EditTask;
