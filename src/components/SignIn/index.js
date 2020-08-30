import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { GoogleLoginButton } from "react-social-login-buttons";
import { Row, Col } from 'reactstrap';

const SignInPage = () => (
  <Row>
    <Col xs={12}>
    <h1 style={{textAlign:`center`}} className="mt-5">Log In</h1>
    </Col>
    {/* <SignInForm /> */}
    <Col xs={12} className="d-flex justify-content-center">
      <SignInGoogle/>
    </Col>

    {/* <PasswordForgetLink /> */}

    {/* <SignUpLink /> */}
  </Row>
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
 
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { error: null };
  }
 
  onSubmit = event => {
    this.props.firebase
    .doSignInWithGoogle()
    .then(socialAuthUser => {
      // Create a user in your Firebase Realtime Database too
      return this.props.firebase
        .user(socialAuthUser.user.uid)
        .set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
    })
    .then(() => {
      this.setState({ error: null });
      this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {
      this.setState({ error });
    });
    event.preventDefault();
  };
 
  render() {
    const { error } = this.state;
 
    return (
      <form onSubmit={this.onSubmit}>
        {/* <button type="submit">Sign In with Google</button> */}
        <GoogleLoginButton type="submit" style={{marginTop: `150px`}}/>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);
 
export default SignInPage;
 
export { SignInForm };
