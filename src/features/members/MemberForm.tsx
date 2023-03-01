import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addNewMemberAsync,
  updateMemberAsync,
  resetAddMemberState,
  selectMembersExtrasAddStatus,
  selectMemberStatusById,
  resetMemberStateById,
} from "./membersSlice";
import { fetchMembersAsync } from "./membersSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import type { Member } from "./membersSlice";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

interface FormInputs {
  name: string;
}

const MemberForm: React.FC<{ member?: Member }> = ({ member }) => {
  const dispatch = useAppDispatch();
  const memberAddStatus = useAppSelector(selectMembersExtrasAddStatus);
  const navigate = useNavigate();

  const memberStatus = useAppSelector((state) =>
    selectMemberStatusById(state, member?.id ?? NaN)
  );

  const [loading, setLoading] = useState(false);

  const initialValues: FormInputs = {
    name: member?.name ?? "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: FormInputs) => {
    if (member) {
      dispatch(updateMemberAsync({ id: member.id, data }));
    } else {
      dispatch(addNewMemberAsync(data));
    }
  };

  useEffect(() => {
    if (!member) {
      dispatch(resetAddMemberState());
    } else {
      dispatch(resetMemberStateById(member.id));
    }
    dispatch(fetchMembersAsync());
  }, []);

  useEffect(() => {
    if (!member) {
      if (memberAddStatus === "created") {
        setLoading(false);
        dispatch(resetAddMemberState());
        navigate(ROUTES.MEMBERS);
      } else if (memberAddStatus === "failed") {
        alert("Add member failed!");
        setLoading(false);
        dispatch(resetAddMemberState());
      } else if (memberAddStatus === "creating") {
        setLoading(true);
      }
    }
  }, [memberAddStatus]);

  useEffect(() => {
    if (member) {
      if (memberStatus === "loading") {
        setLoading(true);
      } else if (memberStatus === "succeeded") {
        setLoading(false);
        dispatch(resetMemberStateById(member.id));
        navigate(`${ROUTES.MEMBERS}`);
      } else if (memberStatus === "failed") {
        setLoading(false);
        dispatch(resetMemberStateById(member.id));
        alert("Member update failed!");
      }
    }
  }, [memberStatus]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
      }}
    >
      {loading && <Spinner />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>{member ? "Update Member Form" : "Add New Member Form"}</h2>

        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("name")}
          />
          <Form.Text className="text-warning">{errors.name?.message}</Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default MemberForm;
