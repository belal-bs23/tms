import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  registerAsync,
  selectAuthIsLoggedIn,
  resetAuthState,
  selectAuthStatus,
  selectAuthError,
} from "./authSlice";

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
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);
  const authStatus = useAppSelector(selectAuthStatus);
  const authErrors = useAppSelector(selectAuthError);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    dispatch(registerAsync(data));
  };

  useEffect(() => {
    dispatch(resetAuthState());
    setErrorMessage("");
  }, []);

  useEffect(() => {
    if (authStatus === "loading") {
      setErrorMessage("");
      setLoading(true);
    } else if (authStatus === "succeeded") {
      setLoading(false);
      dispatch(resetAuthState());
    } else if (authStatus === "failed") {
      setLoading(false);
      setErrorMessage(authErrors);
      dispatch(resetAuthState());
    }
  }, [authStatus]);

  useEffect(() => {
    if (errorMessage && isValidating) {
      setErrorMessage("");
      if (authErrors) dispatch(resetAuthState());
    }
  }, [isValidating, errorMessage, authErrors]);

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
      {loading && <Spinner />}
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

        <div>
          <p className="text-danger">{errorMessage}</p>
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div className="d-flex flex-row align-items-center mt-3">
          Already have an account?{" "}
          <Button
            onClick={() => navigate(`${ROUTES.AUTH}/${ROUTES.SIGNIN}`)}
            className="btn-sm"
            variant="link"
          >
            Signin
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
