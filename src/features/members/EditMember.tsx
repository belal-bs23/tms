import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectMemberById, resetMemberStateById } from "./membersSlice";

import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import MemberForm from "./MemberForm";

function EditMember() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const memberId = params?.id ? Number(params?.id) : NaN;
  const navigate = useNavigate();

  const member = useAppSelector((state) => selectMemberById(state, memberId));

  useEffect(() => {
    if (memberId) {
      dispatch(resetMemberStateById(memberId));
    }
  }, []);

  return member ? (
    <MemberForm member={member} />
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

export default EditMember;
