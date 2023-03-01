import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addNewTaskAsync,
  resetAddTaskState,
  selectTasksExtrasAddStatus,
} from "./tasksSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  memberId: Yup.number().required("Please select member"),
});

interface FormInputs {
  title: string;
  description: string;
  memberId: number;
}

function AddTask() {
  const dispatch = useAppDispatch();
  const taskAddStatus = useAppSelector(selectTasksExtrasAddStatus);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    dispatch(addNewTaskAsync(data));
  };

  useEffect(() => {
    dispatch(resetAddTaskState());
  }, []);

  useEffect(() => {
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
  }, [taskAddStatus]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      {loading && <Spinner />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Task Form</h2>

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
          <Form.Label>Member Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter memberId"
            {...register("memberId")}
          />
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
}

export default AddTask;
