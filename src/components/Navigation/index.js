import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavbarComponent authUser={authUser} />
      ) : (
          <NavbarComponent authUser={false} />
        )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
    )}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavbarComponent = ({ authUser }) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">TIME</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {authUser ?
              <div>
                <NavItem>
                  <Link to={ROUTES.LANDING}>Landing</Link>
                </NavItem>
                <NavItem>
                  <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
                </NavItem>
                <NavItem>
                  <Link to={ROUTES.ACCOUNT}>Account</Link>
                </NavItem>
                <NavItem>
                <SignOutButton />

                </NavItem>
              </div>
              :
              <div>
                <NavItem>
                  <Link to={ROUTES.LANDING}>Landing</Link>
                </NavItem>
                <NavItem>
                  <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                </NavItem>
              </div>
            }
          </Nav>
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>
    </div>
  )
}
export default Navigation;