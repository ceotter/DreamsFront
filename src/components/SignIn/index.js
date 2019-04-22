import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose'

//styled
import { AuthFormTitleS } from '../styledComponents/formTitles';
import { InputS } from '../styledComponents/inputs';
import { AuthButtonS } from '../styledComponents/authButtons';
import { PageStyleS, BlobContainer1S, SignInPageS, SignInLinkS } from './styled'
import ColorBlob from '../ColorBlob';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/routes';


const SignInPage = () => (
  <SignInPageS>
    <AuthFormTitleS
    id="test-signin-h1"
    formTitleBottomMargin={-80}
    formTitleTopMargin={0}>
    Sign In</AuthFormTitleS>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </SignInPageS>
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
        this.obtainToken();
        this.props.history.push(ROUTES.DREAM_ARCHIVE);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  
  obtainToken = () => {
    this.props.firebase.getServerToken();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return(
      <PageStyleS>
         <BlobContainer1S>
          <ColorBlob/>
        </BlobContainer1S>
        <form onSubmit={this.onSubmit}>
          <InputS
            inputPadding={5}
            id="test-input-email"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <InputS
            inputPadding={5}
            id="test-input-password"
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <AuthButtonS
            id="test-button-signin-submit"
            disabled={isInvalid}
            type="submit">
            Sign In
          </AuthButtonS>
          {error && <p>{error.message}</p>}
        </form>
      </PageStyleS>
    );
  }
}

const SignInLink = () => (
  <SignInLinkS>
    Already have an account? <Link id="test-link-signin" to={ROUTES.SIGN_IN}>Sign In</Link>
  </SignInLinkS>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);



export default SignInPage;

export { SignInForm, SignInLink };
