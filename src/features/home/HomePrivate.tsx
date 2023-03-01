import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";

function HomePrivate() {
  const navigate = useNavigate();
  return (
    <div
      className="justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      <div>
        <h2>Welcome to the Task Management System!</h2>
        <p>
          A task management tool is used by an individual, team, or organization
          to complete projects efficiently by organizing and prioritizing
          related tasks. Task management tools come in many forms, like basic
          spreadsheets or online project management applications.
        </p>
      </div>
      <br />
      <div className="row">
        <h2>Get started</h2>
      </div>
      <div className="d-flex justify-content-around">
        <Button
          style={{
            width: "150px",
            height: "75px",
          }}
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate(ROUTES.TASKS)}
        >
          <span className="mx-auto">Tasks</span>
        </Button>
        <Button
          style={{
            width: "150px",
            height: "75px",
          }}
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate(ROUTES.MEMBERS)}
        >
          <span className="mx-auto">Members</span>
        </Button>
      </div>
    </div>
  );
}

export default HomePrivate;
