import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginAsync,
  resetAuthState,
  selectAuthError,
  selectAuthStatus,
} from "./authSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ROUTES } from "../../routes/routes";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    dispatch(loginAsync(data));
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
      setErrorMessage("Invalid credential");
      dispatch(resetAuthState());
    }
  }, [authStatus]);

  useEffect(() => {
    if (errorMessage && isValidating) {
      setErrorMessage("");
      if (authErrors) dispatch(resetAuthState());
    }
  }, [isValidating, errorMessage, authErrors]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      {loading && <Spinner />}
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

        <div>
          <p className="text-danger">{errorMessage}</p>
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div className="d-flex flex-row align-items-center mt-3">
          Do not have an account ?{" "}
          <Button
            onClick={() => navigate(`${ROUTES.AUTH}/${ROUTES.SIGNUP}`)}
            className="btn-sm"
            variant="link"
          >
            SignUp
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signin;
