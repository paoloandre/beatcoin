// // signup is successfull, couple things to tweak
//
// import React from "react";
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// // import Dialog from "material-ui/Dialog";
// import RaisedButton from "material-ui/RaisedButton";
// import TextField from "material-ui/TextField";
// import CircularProgress from "material-ui/CircularProgress";
//
// import { validateInput } from "../utils/signupUtil";
//
// import { userSignupRequest } from "../actions/signupActions";
// import { addFlashMessage, deleteFlashMessage } from "../actions/flashMessages";
//
// import PropTypes from "prop-types"; // react prop types are deprecated
// import { connect } from "react-redux";
// import { linkLogic } from "../utils/linkLogic";
//
// var link = linkLogic();
//
//
// class SignUp extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//       username: "",
//       password: "",
//       email: "",
//       name: "",
//       passwordConfirmation: "",
//       errors: "",
//       isLoading: false
//     };
//     // since we lost the scope for the on change
//   //   this.onChange = this.onChange.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//   //   this.handleOpen = this.handleOpen.bind(this);
//     this.clearFields = this.clearFields.bind(this);
//     // this.isValid = this.isValid.bind(this);
//   }
//   //
//   // handleOpen() {
//   //   this.setState({ open: true });
//   // }
//   //
//
//   clearFields() {
//     this.setState({
//       open: false,
//       username: "",
//       password: "",
//       email: "",
//       name: "",
//       passwordConfirmation: "",
//       errors: ""
//     });
//   }
//
//   // onChange(e) {
//   //   this.setState({ [e.target.name]: e.target.value });
//   // }
//
//   // client side validation
//   isValid() {
//     // returns a true or false
//     const { errors, isValid } = validateInput(this.state);
//     // if it ain't valid we populate the state with the errors received
//     if (!isValid) {
//       this.setState({ errors });
//     }
//     return isValid;
//   }
//
//   // when we submit the form with the even trigger on the button
//   onSubmit(e) {
//     if (this.isValid()) {
//       this.setState({ errors: {}, isLoading: true });
//       e.preventDefault();
//       console.log("success");
//       userSignupRequest(this.state, function (err, callback) {
//           if (err){
//             console.log("error");
//             // if we get an error back with errors with it with populate the state with the data
//             this.setState({ errors: err.response.data, isLoading: false });
//           }
//           // if everything is succesfull
//           console.log("success");
//           this.setState({
//             username: "",
//             password: "",
//             email: "",
//             name: "",
//             passwordConfirmation: "",
//             isLoading: false
//           });
//
//           addFlashMessage({
//             type: "success",
//             text: "You signed up successfully. Welcome !"
//           });
//
//           this.context.router.history.replace('/');
//           this.clearFields();
//           deleteFlashMessage();
//       });
//   }
// }
//
//   render() {
//     const { userSignupRequest, addFlashMessage, deleteFlashMessage } = this.props;
//     const { errors } = this.state;
//
//     // const actions = [
//     //   <RaisedButton
//     //     label="Cancel"
//     //     primary={true}
//     //     backgroundColor="#a4c639"
//     //     onTouchTap={this.handleClose}
//     //     style={{ margin: "10px" }}
//     //   />,
//     //   <RaisedButton
//     //     label="Submit"
//     //     primary={true}
//     //     backgroundColor="#a4c639"
//     //     keyboardFocused={true}
//     //     onTouchTap={this.onSubmit}
//     //     disabled={this.state.isLoading}
//     //   />
//     // ];
//
//     return (
//       <div>
//         <MuiThemeProvider>
//           <div>
//         {/* <RaisedButton label="Sign Up!" onTouchTap={this.handleOpen} />
//         <Dialog
//           title="Signing up"
//           actions={actions}
//           modal={false}
//           open={this.state.open}
//           onRequestClose={this.handleClose}
//         > */}
//           <TextField
//             hintText="Your full name"
//             fullWidth={true}
//             name="name"
//             value={this.state.name}
//             onChange={(event,newValue) =>
//             this.setState({name:newValue})}
//             errorText={errors.name}
//           />
//           <br />
//           <TextField
//             hintText="Choose a username"
//             fullWidth={true}
//             name="username"
//             value={this.state.username}
//             onChange={(event,newValue) =>
//             this.setState({username:newValue})}
//             errorText={errors.username}
//           />
//           <br />
//           <TextField
//             hintText="E-mail"
//             fullWidth={true}
//             name="email"
//             value={this.state.email}
//             onChange={(event,newValue) =>
//             this.setState({email:newValue})}
//             errorText={errors.email}
//           />
//           <br />
//           <TextField
//             hintText="Choose a password"
//             fullWidth={true}
//             type="password"
//             name="password"
//             value={this.state.password}
//             onChange={(event,newValue) =>
//             this.setState({password:newValue})}
//             errorText={errors.password}
//           />
//           <TextField
//             hintText="Reconfirm your password"
//             fullWidth={true}
//             type="password"
//             name="passwordConfirmation"
//             value={this.state.passwordConfirmation}
//             onChange={(event,newValue) =>
//             this.setState({passwordConfirmation:newValue})}
//             errorText={errors.passwordConfirmation}
//           />
//           <br />
//           <br />
//           {this.state.isLoading && <CircularProgress />}
//           {/* <p>{this.props.messages.text}</p> */}
//         {/* </Dialog> */}
//         <RaisedButton
//             label="Cancel"
//             primary={true}
//             backgroundColor="#a4c639"
//             onTouchTap={this.clearFields}
//             style={{ margin: "10px" }}
//           />,
//           <RaisedButton
//             label="Submit"
//             primary={true}
//             backgroundColor="#a4c639"
//             keyboardFocused={true}
//             onTouchTap={this.onSubmit}
//             disabled={this.state.isLoading}
//           />
//         </div>
//           </MuiThemeProvider>
//       </div>
//     );
//   }
// }
//
// function mapStateToProps(state) {
//   return {
//     messages: state.flashMessages
//   };
// }
//
// SignUp.contextTypes = {
//   router: PropTypes.object.isRequired
// };
//
// export default SignUp;
// // export default connect(mapStateToProps, {
// //   addFlashMessage,
// //   deleteFlashMessage
// // })(SignUp);
