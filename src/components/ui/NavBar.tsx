import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { ROUTES } from "../../routes/routes";
import logo from "../../assets/images/logo.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  logoutAndResetStore,
  selectAuthUser,
} from "../../features/auth/authSlice";

function NavBar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState(() => {
    let tabName = "home";
    if (location.pathname.startsWith(ROUTES.TASKS)) {
      tabName = "tasks";
    } else if (location.pathname.startsWith(ROUTES.MEMBERS)) {
      tabName = "members";
    }

    return tabName;
  });

  const handleSelect = (
    eventKey: string | null,
    e: React.SyntheticEvent<unknown>
  ) => {
    if (activeKey !== eventKey && eventKey === "home") {
      setActiveKey("home");
    } else if (activeKey !== eventKey && eventKey === "tasks") {
      setActiveKey("tasks");
    } else if (activeKey !== eventKey && eventKey === "members") {
      setActiveKey("members");
    }
  };

  const onClickLogout = () => {
    dispatch(logoutAndResetStore());
    navigate(ROUTES.HOME);
  };

  useEffect(() => {
    if (activeKey !== "home" && location.pathname === ROUTES.HOME) {
      setActiveKey("home");
    } else if (
      activeKey !== "tasks" &&
      location.pathname.startsWith(ROUTES.TASKS)
    ) {
      setActiveKey("tasks");
    } else if (
      activeKey !== "members" &&
      location.pathname.startsWith(ROUTES.MEMBERS)
    ) {
      setActiveKey("members");
    }
  }, [location.pathname, activeKey]);

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand>
            <span className="d-inline-block align-top">
              <img src={logo} width="70" height="70" alt="TMS logo" />
              <span>Task Management</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Container>
            <Nav className="justify-content-end d-flex flex-row align-items-center">
              <Nav.Item>{user.name}</Nav.Item>
              <Nav.Item>
                <Button
                  className="btn-sm"
                  variant="link"
                  onClick={onClickLogout}
                >
                  Logout
                </Button>
              </Nav.Item>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Nav onSelect={handleSelect} activeKey={activeKey}>
                <Nav.Item>
                  <Nav.Link
                    onClick={() => navigate(ROUTES.HOME)}
                    eventKey="home"
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    onClick={() => navigate(ROUTES.TASKS)}
                    eventKey="tasks"
                  >
                    Tasks
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    onClick={() => navigate(ROUTES.MEMBERS)}
                    eventKey="members"
                  >
                    Members
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Container>
      </Navbar>
      <hr />
    </div>
  );
}

export default NavBar;
