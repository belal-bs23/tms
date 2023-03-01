import React, { useEffect, useState } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ROUTES } from "../../routes/routes";
import { selectAllTasks, type Task } from "../tasks/tasksSlice";
import {
  selectMemberById,
  deleteMemberAsync,
  selectMemberStatusById,
  resetMemberRequiredReloadById,
  resetMembers,
} from "./membersSlice";

const TaskItem: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <li
      key={index}
      className="d-flex justify-content-start"
      style={{
        width: "100%",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          width: "100%",
        }}
      >
        <div className="d-flex align-items-center">
          <span>{index + 1}.</span>
          <Button
            variant="link"
            onClick={() => navigate(`${ROUTES.TASKS}/${task.id}`)}
          >
            {task.title}
          </Button>
        </div>
      </div>
    </li>
  );
};

function MemberDetail() {
  const params = useParams();
  const memberId = params?.id ? Number(params?.id) : NaN;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const member = useAppSelector((state) => selectMemberById(state, memberId));
  const memberStatus = useAppSelector((state) =>
    selectMemberStatusById(state, memberId)
  );

  const allTasks = useAppSelector(selectAllTasks);
  const tasks =
    allTasks && allTasks?.length > 0
      ? allTasks.filter((task) => task?.memberId === memberId)
      : [];

  const [loading, setLoading] = useState(false);

  const handleOnClickDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      console.log("Deleting");
      dispatch(deleteMemberAsync({ id }));
    } else {
      console.log("Canceling delete.");
    }
  };

  useEffect(() => {
    dispatch(resetMemberRequiredReloadById(memberId));
  }, []);

  useEffect(() => {
    if (memberStatus === "deleting") {
      setLoading(true);
    } else if (memberStatus === "deleted") {
      setLoading(false);
      dispatch(resetMembers());
      navigate(ROUTES.MEMBERS);
    } else if (memberStatus === "failed") {
      alert("Member deletion failed");
    }
  }, [memberStatus]);

  return member ? (
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
                navigate(`${pathname}/${ROUTES.EDIT_MEMBER}`);
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
              onClick={() => handleOnClickDelete(member.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <br />
      <div>
        <h3>Name: {member.name}</h3>
      </div>
      <br />
      <div className="d-flex justify-content-start align-items-center">
        <h3>Tasks:</h3>
      </div>
      <div
        style={{
          width: "50%",
        }}
      >
        <ul>
          {tasks &&
            tasks.map(
              (task, index) =>
                task && <TaskItem key={index} task={task} index={index} />
            )}
        </ul>
      </div>
    </div>
  ) : (
    <div>
      <h3 className="text-warning text-center">Member does not exist!</h3>
      <div>
        <Button
          variant="link"
          className="btn-sm"
          onClick={() => {
            navigate(ROUTES.MEMBERS);
          }}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default MemberDetail;
