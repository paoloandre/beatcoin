// import React, { Component } from "react";
// import axios from "axios";
// import PropTypes from "prop-types"; // react prop types are depecrated
// import { connect } from "react-redux";
// import Paper from "material-ui/Paper";
// import { List, ListItem } from "material-ui/List";
// import RaisedButton from "material-ui/RaisedButton";
// import TextField from "material-ui/TextField";
// import Paginator from "react-paginate";
// import { linkLogic } from "../utils/linkLogic";
// // pdf generator
// import pdfConverter from "jspdf";
//
// /* TODO this and that */
//
//
//
// var link = linkLogic();
//
//
// export class CardManagement extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       _id: this.props.authen.id,
//       amount: 0,
//       pageToLoad: 1,
//       totalPages: 0,
//       totalTransactions: [],
//       transactions: []
//     };
//     // binding to the actual scope that we have
//     this.onChange = this.onChange.bind(this);
//     this.onChangePage = this.onChangePage.bind(this);
//     this.onStampa = this.onStampa.bind(this);
//   }
//
//   componentDidMount() {
//     axios
//       .get( link + "/users/profile/" + this.state.pageToLoad)
//       .then(response => {
//         this.setState({
//           transactions: response.data.transactions.docs,
//           totalPages: response.data.transactions.pages
//         });
//       });
//   }
//
//   onChange(e) {
//     this.setState({ [e.target.name]: parseFloat(e.target.value) || 0 });
//   }
//
//   onChangePage(page) {
//     console.log(page.selected);
//     this.setState({ pageToLoad: page.selected + 1 }, () => {
//       axios
//           .get(link + "/users/profile/" + this.state.pageToLoad)
//         .then(response => {
//           console.log(response.data.transactions);
//           this.setState({ transactions: response.data.transactions.docs });
//         });
//     });
//   }
//
//   // function that basically uses jsPdf that basically sends a request to the api and prints all the transaction of that person
//   // we basically instanciate a pdfCOnvert object and feed it the data from the api
//   onStampa() {
//     var doc = new pdfConverter("p", "pt", "a4");
//
//     axios.get(link + "/users/AllTransactions").then(response => {
// 	  // adding text creates a doc.addPage by default
// 	  var requiredPages = Math.ceil(response.data.transactions.length / 30);
// 	  console.log(requiredPages);
//       var from = 0;
//       var to = 40;
//
//       doc.text(
//         20,
//         50,
//         "Data" +
//           "                " +
//           "Origine" +
//           "                " +
//           "     Destinatario" +
//           "      " +
//           "   Balance"
//       );
//       doc.setFontSize(13);
//
//       for (var i = 1; i <= requiredPages; ++i) {
//         doc.setPage(i);
//
//         console.log(" from : " + from + " " + " to: " + to + "  page : " + i);
//         response.data.transactions.slice(from, to).map((transaction, index) => {
//           if (transaction.senderCard === this.props.authen.card) {
//             transaction.transactionBalance = -transaction.transactionBalance;
//           } else {
//             transaction.transactionBalance =
//               "+" + transaction.transactionBalance;
//           }
//
//           doc.text(
//             20,
//             70 + index * 17,
//             new Date(transaction.date).getDate() +
//               "/" +
//               (new Date(transaction.date).getMonth() + 1) +
//               "/" +
//               new Date(transaction.date).getFullYear() +
//               "        " +
//               transaction.senderCard +
//               "        " +
//               transaction.receiverCard +
//               "        " +
//               transaction.transactionBalance
//           );
//         });
//
//         from = from + 41;
//         to = to + 40;
//
//         if (requiredPages === i) {
//           console.log("this is the last iteration");
//         } else {
//           doc.addPage();
//         }
//       }
//
//       doc.save("Lista dei Movimenti.pdf");
//     });
//   }
//
//   render() {
//     var filteredTransactions = this.state.transactions.map(transaction => {
//       if (transaction.senderCard === this.props.authen.card) {
//         transaction.transactionBalance = -transaction.transactionBalance;
//       } else {
//         transaction.transactionBalance = "+" + transaction.transactionBalance;
//       }
//     });
//
//     var transactionList = (
//       <tbody>
//         {this.state.transactions.map(transaction => (
//           <tr key={transaction._id}>
//             <td>
//               {new Date(transaction.date).getDate() +
//                 "/" +
//                 (new Date(transaction.date).getMonth() + 1) +
//                 "/" +
//                 new Date(transaction.date).getFullYear()}{" "}
//             </td>
//             <td>{transaction.senderCard}</td>
//             <td>{transaction.receiverCard}</td>
//             <td>{transaction.transactionBalance}</td>
//           </tr>
//         ))}
//       </tbody>
//     );
//
//     return (
//       <div className="cardmanagement">
//         <div className="ui grid stackable">
//           <div className="ten wide column">
//             <h1>Lista dei Movimenti </h1>
//             <table className="ui celled striped table unstackable">
//               <thead>
//                 <tr>
//                   <th>Data Contabile</th>
//                   <th>Origine:</th>
//                   <th>Destinazione(euro)</th>
//                   <th>Descrizione Operazione</th>
//                 </tr>
//               </thead>
//
//               {transactionList}
//
//               <tfoot>
//                 <tr>
//                   <th colSpan={5}>
//                     <div className="pagination">
//                       <Paginator
//                         max={5}
//                         onPageChange={this.onChangePage}
//                         pageCount={this.state.totalPages}
//                       />
//                     </div>
//                   </th>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//           <div className="six wide column">
//             <RaisedButton
//               label="Stampa Tutti I Movimenti "
//               primary={true}
//               onTouchTap={this.onStampa}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
//
// CardManagement.contextTypes = {
//   router: PropTypes.object.isRequired
// };
//
// function mapStateToProps(state) {
//   return {
//     authen: state.authen
//   };
// }
//
// export default connect(mapStateToProps )(
//   CardManagement
// );
