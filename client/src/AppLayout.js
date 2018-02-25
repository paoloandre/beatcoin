import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import NavBar from './components/NavBar'
import Portal from './components/Portal'
import Profile from './components/Profile'
import Login from './components/LoginDialog'
import SignUp from './components/SignUp'
import CardManagement from './components/CardManagement'

import requireAuth from './utils/requireAuth'

import './App.css'

// The Navbar contains the LoginDialog and the SignUp component
// this component returns other components
// if anything changes in one of the children, it will re-render the whole thing

// requireAuth is a function, kinda middleware-like that takes a component
// and checks some boolean values
// keep in mind that this is only client side validation
// if someone knows about the existance of Postman you'de be doomed

export default class AppLayout extends React.Component {

constructor(props) {
	super(props);
 }

  render() {
	return (
		<Router>
			  <div className ="App">
										<NavBar />

                        <main className="cd-main-content">
							<Switch>
										<Route exact path="/" component={Portal} />
										<Route exact path="/login" component={Login} />
										<Route exact path="/signup" component={SignUp} />
										<Route exact path="/profile" component={requireAuth(Profile)} />
										<Route exact path="/cardmanagement" component={requireAuth(CardManagement)} />
		  				 </Switch>

                        </main>

			  </div>
		 </Router>
	);
  }
}
