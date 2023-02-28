import React from "react";
import { Button, Form } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import { loginAsync } from "./authSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ROUTES } from "../../routes/routes";

const validationSchema = Yup.object({
  email: Yup.string().required("Email is required").email(),
  password: Yup.string().required("Password is required"),
});

interface FormInputs {
  email: string;
  password: string;
}

function Signin() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    dispatch(loginAsync(data));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signin Form</h2>

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

        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div className="d-flex flex-row align-items-center mt-3">
          Do not have an account ?{" "}
          <Button href={ROUTES.SIGNUP} className="btn-sm" variant="link">
            SignUp
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signin;
