import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchMembersAsync, selectAllMembers } from "./membersSlice";
import styles from "./Counter.module.css";

function Members() {
  const members = useAppSelector(selectAllMembers);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Welcome to Members page!</h1>
    </div>
  );
}

export default Members;
