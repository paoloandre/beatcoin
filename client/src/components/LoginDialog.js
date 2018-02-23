// still fix the login animation thing to actually react to the login

import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Dialog from "material-ui/Dialog";
// import LoginDude from "material-ui/svg-icons/action/perm-identity";
import TextField from "material-ui/Textfield";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { connect } from "react-redux";
import PropTypes from "prop-types"; // react prop types are depecrated

import { userSignupRequest } from "../actions/signupActions";
import { addFlashMessage } from "../actions/flashMessages";

import { setCurrentUser } from "../actions/login";
import { login } from "../actions/login";

import { validateInput } from "../utils/login";
import setAuthorizationToken from "../utils/setAuthorizationToken";

import jwt from "jsonwebtoken";
import SignUp from "./SignUp";

export class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      username: "",
      password: "",
      errors: "",
      isLoading: false
    };
    // binding to the actual scope that we have
        // this.onChange = this.onChange.bind(this);
        // this.handleOpen = this.handleOpen.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    // if it ain't valid we populate the state with the errors received
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  // handleOpen() {
  //   this.setState({ open: true });
  // }
  //
  // handleClose() {
  //   this.setState({ open: false });
  // }
  //
  // onChange(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (this.isValid()) {
      this.props.login(this.state).then(
        // when login is correct we will redirect
        response => {
          if (response.data.errors) {
            this.setState({ errors: response.data.errors, isLoading: false });
          } else {
            this.setState({ errors: "", isLoading: false });
            localStorage.setItem("jwtToken", response.data.token);
            setAuthorizationToken(response.data.token);
            const decodedToken = jwt.decode(response.data.token);
            this.props.setCurrentUser(decodedToken._doc);
            this.context.router.history.replace("/profile");
          }
        },
        err => {
          console.log(err);
        }
      );
    }
    /* const decodedToken = jwt.decode(localStorage.getItem('jwtToken'));
		console.log(decodedToken._doc); */
  }

  render() {
    const { userSignupRequest, addFlashMessage } = this.props;
    const { errors } = this.state;

    // const actions = [
    //   <RaisedButton
    //     label="Login"
    //     secondary={true}
    //     keyboardFocused={true}
    //     onTouchTap={this.onSubmit}
    //     style={{ marginBottom: "10px" }}
    //   />,
    //
    //   <SignUp
    //     userSignupRequest={userSignupRequest}
    //     addFlashMessage={addFlashMessage}
    //   />
    // ];

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <TextField
              hintText="Username"
              fullWidth={true}
              name="username"
              value={this.state.username}
              onChange={(event,newValue) =>
              this.setState({username:newValue})}
              errorText={errors.username}
            />
            <br/>
            <TextField
              hintText="Password"
              fullWidth={true}
              name="password"
              value={this.state.password}
              onChange={(event,newValue) =>
              this.setState({password:newValue})}
              errorText={errors.password}
            />
            <br/>
            <RaisedButton label="Login" primary={true}
            onClick={(e) => this.onSubmit(e)}/>
          </div>
        </MuiThemeProvider>


        {/* <FlatButton
          icon={<LoginDude />}
          className="loginButton"
          label="Login"
          onTouchTap={this.handleOpen}
        />
        <Dialog
          title="Login"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="User Name"
            fullWidth={true}
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            errorText={errors.username}
          />
          <br />
          <br />
          <TextField
            hintText="Password"
            fullWidth={true}
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            type="password"
            errorText={errors.password}
          />
        </Dialog> */}
      </div>
    );
  }
}

LoginDialog.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginDialog;
// export default connect(null, {
//   userSignupRequest,
//   addFlashMessage,
//   setCurrentUser,
//   login
// })(LoginDialog);
