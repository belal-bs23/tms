import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  fetchMembersAsync,
  selectAllMembers,
  selectMembersRequiredReload,
} from "./membersSlice";
import { ROUTES } from "../../routes/routes";
import { useLocation, useNavigate } from "react-router-dom";
import {
  type Member,
  selectNumberOfTasksByMemberId,
} from "../tasks/tasksSlice";

const MemberItem: React.FC<{ member: Member; index: number }> = ({
  member,
  index,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const numberOfTasks = useAppSelector((state) =>
    selectNumberOfTasksByMemberId(state, member.id)
  );
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
            onClick={() => navigate(`${pathname}/${member.id}`)}
          >
            {member.name}
          </Button>
        </div>
        <div>
          <span>
            {numberOfTasks > 0
              ? `${numberOfTasks} ${numberOfTasks > 1 ? "Tasks" : "Task"}`
              : "No task"}
          </span>
        </div>
      </div>
    </li>
  );
};

function Members() {
  const dispatch = useAppDispatch();
  const members = useAppSelector(selectAllMembers);
  const membersRequiredReload = useAppSelector(selectMembersRequiredReload);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (membersRequiredReload) {
      dispatch(fetchMembersAsync());
    }
  }, [membersRequiredReload, dispatch]);

  useEffect(() => {
    dispatch(fetchMembersAsync());
  }, []);

  return (
    <div>
      <div>
        <h2>All members</h2>
        <p>You will find all members here.</p>
      </div>
      <br />
      <div className="d-flex justify-content-start align-items-center">
        <h3>Here is all members:</h3>
        <div className="mx-5">
          <Button
            onClick={() => {
              navigate(`${pathname}/${ROUTES.ADD_MEMBER}`);
            }}
            className="btn-sm"
            variant="secondary"
          >
            Add new
          </Button>
        </div>
        {/* <div className="mx-5">
          <Button
            onClick={() => {
              dispatch(fetchMembersAsync());
            }}
            className="btn-sm"
            variant="secondary"
          >
            Refresh
          </Button>
        </div> */}
      </div>
      <div
        style={{
          width: "50%",
        }}
      >
        <ul>
          {members &&
            members.map(
              (member, index) =>
                member && (
                  <MemberItem key={index} member={member} index={index} />
                )
            )}
        </ul>
      </div>
    </div>
  );
}

export default Members;
