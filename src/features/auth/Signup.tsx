import React, { useEffect } from "react";
import { redirect } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { registerAsync, selectAuthIsLoggedIn } from "./authSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ROUTES } from "../../routes/routes";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email(),
  password: Yup.string().required("Password is required"),
  password2: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

interface FormInputs {
  name: string;
  email: string;
  password: string;
  password2: string;
}

function Signup() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    dispatch(registerAsync(data));
  };

  useEffect(() => {
    if (isLoggedIn) {
      redirect(ROUTES.HOME);
    }
  }, [isLoggedIn]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signup Form</h2>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("name")}
          />
          <Form.Text className="text-warning">{errors.name?.message}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email")}
          />
          <Form.Text className="text-warning">
            {errors.email?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <Form.Text className="text-warning">
            {errors.password?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password2")}
          />
          <Form.Text className="text-warning">
            {errors.password2?.message}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div className="d-flex flex-row align-items-center mt-3">
          Already have an account?{" "}
          <Button href={ROUTES.SIGNIN} className="btn-sm" variant="link">
            Signin
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
