import React from "react";
import Button from "react-bootstrap/Button";
import { ROUTES } from "../../routes/routes";

function HomePrivate() {
  return (
    <div
      className="justify-content-center align-items-center text-center"
      style={{
        width: "100%",
      }}
    >
      <h1>Welcome to the Task Management System!</h1>
      <div
        className="d-flex flex-column "
        style={{
          width: "100px",
          margin: "auto",
          marginBottom: "10px",
        }}
      >
        <Button
          style={{
            width: "100px",
            // margin: "auto",
            marginBottom: "10px",
          }}
          href={`${ROUTES.AUTH}/${ROUTES.SIGNIN}`}
        >
          Signin
        </Button>
        <Button
          style={{
            width: "100px",
          }}
          href={`${ROUTES.AUTH}/${ROUTES.SIGNUP}`}
        >
          Signup
        </Button>
      </div>
    </div>
  );
}

export default HomePrivate;
