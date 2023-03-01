import React, { useEffect } from "react";
import "./App.css";
import RootRouter from "./routes/RootRouter";
import { privateAxios } from "./app/axios";
import { useAppSelector } from "./app/hooks";
import { selectAuthToken } from "./features/auth/authSlice";

function App() {
  const token = useAppSelector(selectAuthToken);
  useEffect(() => {
    if (!privateAxios.defaults.headers.common?.Authorization && token) {
      privateAxios.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  }, [token]);

  return <RootRouter />;
}

export default App;
