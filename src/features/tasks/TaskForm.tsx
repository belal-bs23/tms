import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addNewTaskAsync,
  updateTaskAsync,
  resetAddTaskState,
  selectTasksExtrasAddStatus,
  selectTaskStatusById,
  resetTaskStateById,
} from "./tasksSlice";
import {
  fetchMembersAsync,
  selectAllMembers,
  selectMembersRequiredReload,
} from "../members/membersSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import type { Task } from "./tasksSlice";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  memberId: Yup.number()
    .min(1, "Please selcect a member")
    .required("Please select member"),
});

interface FormInputs {
  title: string;
  description: string;
  memberId: number;
}

const TaskForm: React.FC<{ task?: Task }> = ({ task }) => {
  const dispatch = useAppDispatch();
  const members = useAppSelector(selectAllMembers);
  const membersRequiredReload = useAppSelector(selectMembersRequiredReload);
  const taskAddStatus = useAppSelector(selectTasksExtrasAddStatus);
  const navigate = useNavigate();

  const taskStatus = useAppSelector((state) =>
    selectTaskStatusById(state, task?.id ?? 0)
  );

  const [loading, setLoading] = useState(false);

  const initialValues: FormInputs = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    memberId: task?.memberId ?? 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    if (task) {
      dispatch(updateTaskAsync({ id: task.id, data }));
    } else {
      dispatch(addNewTaskAsync(data));
    }
  };

  useEffect(() => {
    if (!task) {
      dispatch(resetAddTaskState());
    } else {
      dispatch(resetTaskStateById(task.id));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchMembersAsync());
  }, [membersRequiredReload]);

  useEffect(() => {
    if (!task) {
      if (taskAddStatus === "created") {
        setLoading(false);
        dispatch(resetAddTaskState());
        navigate(ROUTES.TASKS);
      } else if (taskAddStatus === "failed") {
        alert("Add task failed!");
        setLoading(false);
        dispatch(resetAddTaskState());
      } else if (taskAddStatus === "creating") {
        setLoading(true);
      }
    }
  }, [task, taskAddStatus]);

  useEffect(() => {
    if (task) {
      if (taskStatus === "loading") {
        setLoading(true);
      } else if (taskStatus === "succeeded") {
        setLoading(false);
        dispatch(resetTaskStateById(task.id));
        navigate(`${ROUTES.TASKS}`);
      } else if (taskStatus === "failed") {
        setLoading(false);
        dispatch(resetTaskStateById(task.id));
        alert("Task update failed!");
      }
    }
  }, [task, taskStatus]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      {loading && <Spinner />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>{task ? "Update Task Form" : "Add New Task Form"}</h2>

        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            {...register("title")}
          />
          <Form.Text className="text-warning">
            {errors.title?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            {...register("description")}
          />
          <Form.Text className="text-warning">
            {errors.description?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="memberId">
          <Form.Label>Assigned to</Form.Label>
          <Form.Select {...register("memberId")}>
            {task && task?.Member ? (
              <option value={task.memberId}>{task.Member.name}</option>
            ) : (
              <option value={0}>Select a member</option>
            )}
            {members &&
              members.map((member, index) => (
                <option key={index} value={member.id}>
                  {member.name}
                </option>
              ))}
          </Form.Select>
          <Form.Text className="text-warning">
            {errors.memberId?.message}
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TaskForm;
