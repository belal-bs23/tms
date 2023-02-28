import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { ROUTES } from "../../routes/routes";
import logo from "../../assets/images/logo.png";
import { useAppDispatch } from "../../app/hooks";

import { logoutAuth } from "../../features/auth/authSlice";

function NavBar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeKey] = useState(() => {
    let tabName = "home";
    if (location.pathname.startsWith(ROUTES.TASKS)) {
      tabName = "tasks";
    } else if (location.pathname.startsWith(ROUTES.MEMBERS)) {
      tabName = "members";
    }

    return tabName;
  });
  const user = {
    name: "Belal Hossain",
  };

  const onClickLogout = () => {
    dispatch(logoutAuth());
    navigate(ROUTES.HOME);
  };

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
          <Container className=" ">
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
              <Nav>
                <Nav.Item>
                  <Nav.Link active={activeKey === "home"} href={ROUTES.HOME}>
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link active={activeKey === "tasks"} href={ROUTES.TASKS}>
                    Tasks
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeKey === "members"}
                    href={ROUTES.MEMBERS}
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
