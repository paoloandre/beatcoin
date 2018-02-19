// signup is successfull, couple things to tweak

import React from "react";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import CircularProgress from "material-ui/CircularProgress";

import { validateInput } from "../utils/signupUtil";

import { addFlashMessage, deleteFlashMessage } from "../actions/flashMessages";

import PropTypes from "prop-types"; // react prop types are depecrated
import { connect } from "react-redux";
import { linkLogic } from "../utils/linkLogic";

var link = linkLogic();


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      username: "",
      password: "",
      email: "",
      name: "",
      passwordConfirmation: "",
      errors: "",
      isLoading: false
    };
    // since we lost the scope for the on change
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({
      open: false,
      username: "",
      password: "",
      email: "",
      name: "",
      passwordConfirmation: "",
      errors: ""
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // client side validation
  isValid() {
    // returns a true or false
    const { errors, isValid } = validateInput(this.state);
    // if it ain't valid we populate the state with the errors received
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  // when we submit the form with the even trigger on the button
  onSubmit(e) {
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      e.preventDefault();
      this.props.userSignupRequest(this.state).then(
        // if everything is succesfull
        () => {
          this.setState({
            username: "",
            password: "",
            email: "",
            name: "",
            passwordConfirmation: "",
            isLoading: false
          });

          this.props.addFlashMessage({
            type: "success",
            text: "You signed up successfully. Welcome !"
          });

          // this.context.router.history.replace('/home/1');
          // this.handleClose();
          // this.props.deleteFlashMessage();
        },
        // if we get an error back with errors with it with populate the state with the data
        err => {
          this.setState({ errors: err.response.data, isLoading: false });
        }
      );
    }
  }

  render() {
    const { errors } = this.state;

    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        backgroundColor="#a4c639"
        onTouchTap={this.handleClose}
        style={{ margin: "10px" }}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        backgroundColor="#a4c639"
        keyboardFocused={true}
        onTouchTap={this.onSubmit}
        disabled={this.state.isLoading}
      />
    ];

    return (
      <div>
        <RaisedButton label="Sign Up !" onTouchTap={this.handleOpen} />
        <Dialog
          title="Signing up"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="Your full name"
            fullWidth={true}
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            errorText={errors.name}
          />
          <br />

          <TextField
            hintText="Choose a username"
            fullWidth={true}
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            errorText={errors.username}
          />
          <br />
          <TextField
            hintText="email "
            fullWidth={true}
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            errorText={errors.email}
          />
          <br />
          <TextField
            hintText="Choose a password"
            fullWidth={true}
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            errorText={errors.password}
          />
          <TextField
            hintText="Reconfirm your password"
            fullWidth={true}
            type="password"
            name="passwordConfirmation"
            value={this.state.passwordConfirmation}
            onChange={this.onChange}
            errorText={errors.passwordConfirmation}
          />
          <br />
          <br />

          {this.state.isLoading && <CircularProgress />}

          <p>{this.props.messages.text}</p>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  };
}

SignUp.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {
  addFlashMessage,
  deleteFlashMessage
})(SignUp);
