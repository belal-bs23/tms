import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";
import { ROUTES } from "../../routes/routes";
import logo from "../../assets/images/logo.png";

function NavBar() {
  const location = useLocation();
  const [activeKey] = useState(location.pathname);
  const user = {
    name: "Belal Hossain",
  };

  return (
    <Navbar
      style={
        {
          // backgroundColor: "#00a0db",
          // color: "white",
        }
      }
      className="text-white"
    >
      <Container>
        <Navbar.Brand>
          <span className="d-inline-block align-top">
            <img src={logo} width="70" height="70" alt="TMS logo" />
            <span>Task Management</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Container className="justify-content-end">
          <Nav className="justify-content-end">
            <Nav.Item>
              <Nav.Link>{user.name}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href={ROUTES.LOGOUT}>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={activeKey}>
              <Nav.Item>
                <Nav.Link href={ROUTES.HOME_PRIVATE}>Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href={ROUTES.TASKS}>Tasks</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href={ROUTES.MEMBERS}>Members</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Container>
    </Navbar>
  );
}

export default NavBar;
