// import React from "react";
// import PropTypes from "prop-types"; // react prop types are depecrated
// import { connect } from "react-redux";
// import Paper from "material-ui/Paper";
// import { List, ListItem } from "material-ui/List";
// import TextField from "material-ui/TextField";
// import RaisedButton from "material-ui/RaisedButton";
// import axios from "axios";
//
// import { Bar, Line, Pie } from "react-chartjs-2";
//
// import openSocket from "socket.io-client";
//
// import { linkLogic } from "../utils/linkLogic";
//
// var link = linkLogic();
//
//
// const socket = openSocket(link + "/chat_infra");
//
// class Profile extends React.Component {
//   // changed the promise auth header is sent automatically so when the shit is completed i'll just have to extract the user from it
//
//
//   constructor(props) {
//     var date = new Date();
//     super(props);
//     this.state = {
//       date: date,
//       month: date.getMonth() + 1,
//       cardNumber: "",
//       amount: 0,
//       balance: "",
//       transactions: [],
//       chartData: {}
//     };
//     // this.onCardClick = this.onCardClick.bind(this);
//     // this.cc_format = this.cc_format.bind(this);
//     // this.onChange = this.onChange.bind(this);
//     // this.onTransfer = this.onTransfer.bind(this);
//   }
//
//    // we load the sockets here so we establish the socket layer in the api, live transaction and data is established at
//   // this very crucial point
//   componentDidMount() {
//     axios.get( link + "/users/profile/1").then(response => {
//       console.log("your balance is : " + response.data.user.balance);
//       this.setState({ balance: response.data.user.balance });
//
//       // we only need the dates and the balances
//       var transactionDates = response.data.transactions.docs
//         .slice(0, 12)
//         .map(transaction => {
//           var date =
//             new Date(transaction.date).getDate() +
//             "/" +
//             (new Date(transaction.date).getMonth() + 1) +
//             "/" +
//             new Date(transaction.date).getFullYear();
//           return date;
//         });
//
//       var transactionsBalances = response.data.transactions.docs
//         .slice(0, 12)
//         .map(transaction => {
//           if (transaction.senderCard === this.props.authen.card) {
//             transaction.transactionBalance = -transaction.transactionBalance;
//           } else {
//             transaction.transactionBalance = transaction.transactionBalance;
//           }
//
//           return transaction.transactionBalance;
//         });
//
//       console.log(transactionsBalances);
//
//       this.setState({
//         chartData: {
//           labels: transactionDates,
//           datasets: [
//             {
//               label: "Ultime 12 transazioni",
//               data: transactionsBalances,
//               backgroundColor: "lightblue"
//             }
//           ]
//         }
//       });
//     });
//
//
// 	// we get the personal info for the socket, without we wouldn't identiy the client
//     // that sends the requested socket
//     // this.personalInfo();
//
// 		// this.privateMessage((err, data) => {
// 		//   console.log(data);
// 		//   // second axios request to update the balance after a notification from another user
//     //       axios.get(link + "/users/profile/1").then(response => {
// 		// 	//console.log(response.data.user.balance);
// 		//    this.setState({ balance: response.data.user.balance });
//     //
// 		// 	});
// 		// });
//
//   }
//
//   // these are sockets for real time data transfer
//   // privateMessage(cb) {
//   //   socket.on("whisper", data => cb(null, data));
//   // }
//
//   // socket part is here
//
//   // personalInfo(cb) {
//   //   // we listen for the info to come, if we don't receive or get an err, we got null, else we got an info and we use that info
//   //   socket.on("infoRes", info => cb(null, info));
//   //   socket.emit("infoReq", {
//   //     id: this.props.authen.id,
//   //     creditCard: this.props.authen.card
//   //   });
//   // }
//
//   // TODO this is just a todo
//
//   // onTransfer() {
//   //   axios
//   //       .put(link + "/users/transfer", {
//   //       sender: this.props.authen.card,
//   //       receiver: this.state.cardNumber,
//   //       amount: this.state.amount
//   //     })
//   //     .then(response => {
// 	// 	  console.log(response);
//   //       // if we have a successfully entry in the db, and the successfull manage to happen
//   //       // we let know about the transfer to the receiver
//   //       // if the client received the message emit
//   //       // we 'll make him do another axios request to update his balance
//   //
//   //       socket.emit("send message", {
//   //         name: this.state.cardNumber, // to who are you sending the moneyz
//   //         msg: "You just received some money, congrats !"
//   //       });
//   //
//   //       // update the sender's balance too here
//   //       // second axios request to update the balance after a notification from another user
//   //       axios.get(link + "/users/profile/1").then(response => {
//   //         console.log(response.data.user.balance);
//   //         this.setState({ balance: response.data.user.balance });
//   //       });
//   //     });
//   // }
//
//
//
//   onCardClick(e) {
//     e.preventDefault();
//     this.context.router.history.replace("/cardmanagement");
//   }
//
//   // cc_format(value) {
//   //   var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//   //   var matches = v.match(/\d{4,16}/g);
//   //   var match = (matches && matches[0]) || "";
//   //   var parts = [];
//   //
//   //   for (var i = 0, len = match.length; i < len; i += 4) {
//   //     parts.push(match.substring(i, i + 4));
//   //   }
//   //
//   //   if (parts.length) {
//   //     return parts.join(" ");
//   //   } else {
//   //     return value;
//   //   }
//   // }
//
//   // onChange(e) {
//   //   this.setState({ [e.target.name]: parseFloat(e.target.value) || 0 });
//   // }
//
//   render() {
//     Chart.defaults.global.defaultFontColor = "#fff";
//
//     // we alter the transaction by giving the right sign, either a + or a -
//     this.state.transactions.map(transaction => {
//       if (transaction.senderCard === this.props.authen.card) {
//         transaction.transactionBalance = -transaction.transactionBalance;
//       } else {
//         transaction.transactionBalance = "+" + transaction.transactionBalance;
//       }
//     });
//
//     return (
//       <div className="profile">
//         <div className="ui grid stackable">
//           <div className="five wide column">
//             <Paper
//               zDepth={4}
//               children={
//                 <List>
//                   <ListItem
//                     // primaryText={this.props.authen.username}
//                     disabled={true}
//                     secondaryText="Username"
//                   />
//                   <ListItem
//                     // primaryText={this.state.authen.email}
//                     disabled={true}
//                     secondaryText="Email"
//                   />
//                   <ListItem
//                     // primaryText={this.props.authen.name}
//                     disabled={true}
//                     secondaryText="Name"
//                   />
//                 </List>
//               }
//             />
//           </div>
//
//           <div className="five wide column">
//             <Paper
//               zDepth={4}
//               children={
//                 <List>
//                   <ListItem primaryText="Lista dei Movimenti" disabled={true} />
//                   <div className="ui grid stackable container">
//                     <div className="six wide column">
//                       <img src="https://www.techgoondu.com/wp-content/uploads/2015/03/MasterCard.png" height="70px" />
//                     </div>
//                     {/* <div className="ten wide column">
//                       <ListItem
//                         primaryText={this.cc_format(this.props.authen.card)}
//                         onClick={this.onCardClick}
//                       />
//                     </div> */}
//                   </div>
//                 </List>
//               }
//             />
//           </div>
//
//           <div className="six wide column">
//             <div className="balance2">
//               {" "}
//               Saldo disponibile al{" "}
//               {this.state.date.getDate() +
//                 "/" +
//                 this.state.month +
//                 "/" +
//                 this.state.date.getFullYear()}{" "}
//             </div>
//             <div className="balance">
//               {" "}
//               {Math.round(this.state.balance * 100) / 100} €
//             </div>
//           </div>
//
//           <div className="five wide column">
//             <Paper
//               zDepth={4}
//               children={
//                 <List>
//                   <ListItem primaryText="Bonifico" disabled={true} />
//                   <TextField
//                     hintText="Numero Di Carta"
//                     name="cardNumber"
//                     value={this.state.cardNumber}
//                     onChange={this.onChange}
//                   />
//                   <br />
//                   <TextField
//                     hintText="Quantità €"
//                     type="number"
//                     name="amount"
//                     value={this.state.amount}
//                     onChange={this.onChange}
//                   />
//                   <br />
//                   <RaisedButton
//                     label="trasferire !"
//                     primary={true}
//                     onTouchTap={this.onTransfer}
//                   />
//                 </List>
//               }
//             />
//           </div>
//           <div className="ten wide column chart">
//             <Line
//               data={this.state.chartData}
//               options={{
//                 maintainAspectRatio: true
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
//
// Profile.contextTypes = {
//   router: PropTypes.object.isRequired
// };
//
// function mapStateToProps(state) {
//   return {
//     authen: state.authen
//   };
// }
//
// // export default connect(mapStateToProps)(Profile);
// export default Profile;
