import React from "react";
import axios from "axios";

import "./secondary-sliding-navigation/secondary-sliding-navigation/css/style.css";
import "./secondary-sliding-navigation/secondary-sliding-navigation/css/reset.css";

import "./secondary-sliding-navigation/secondary-sliding-navigation/js/main.js";

import PropTypes from "prop-types"; // react prop types are depecrated

import FlatButton from "material-ui/FlatButton";
import LoginDialog from "./LoginDialog";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/login";


export class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();
    this.context.router.history.replace("/");
  }

  render() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css?family=PT+Sans:400,700"
          rel="stylesheet"
          type="text/css"
        />
        {/* Modernizr */}
        <header>
          <div className="cd-logo">
            <a href="/">
              <img
                src="https://maxcdn.icons8.com/Share/icon/ios7/Animals//koala1600.png"
                height="50px"
                alt="Logo"
              />
            </a>
          </div>
          <nav className="cd-main-nav-wrapper">
            <ul className="cd-main-nav">
              {!this.props.authen.isAuthenticated ? (
                <li>
                  <a>
                    {" "}
                    <LoginDialog />{" "}
                  </a>{" "}
                </li>
              ) : (
                <li>
                  <a>
                    {" "}
                    <FlatButton
                      className="loginButton"
                      label="Log Out"
                      onTouchTap={this.logout.bind(this)}
                    />
                  </a>{" "}
                </li>
              )}
              <li>
                <a href="#0">Assistenza</a>
              </li>
              <li>
                {!this.props.authen.isAuthenticated ? (
                  <a />
                ) : (

                    <a href="/profile">Profile</a>

                )}
              </li>
              <li>
                <a href="#0" className="cd-subnav-trigger">
                  <span>Servizi Online</span>
                </a>
                <ul>
                  <li className="go-back">
                    <a href="#0">Menu</a>
                  </li>
                  <li>
                    <a href="#0">Bonifico</a>
                  </li>
                  <li>
                    <a href="#0">Movimenti Bancari</a>
                  </li>
                  <li>
                    <a href="#0">Le mie carte</a>
                  </li>
                  <li>
                    <a href="#0">hi there </a>
                  </li>
                  <li>
                    <a href="#0">Category 5</a>
                  </li>
                  <li>
                    <a href="#0" className="placeholder">
                      Placeholder
                    </a>
                  </li>
                </ul>
              </li>
            </ul>{" "}
            {/* .cd-main-nav */}
          </nav>{" "}
          {/* .cd-main-nav-wrapper */}
          <a href="#0" className="cd-nav-trigger">
            <span />
          </a>
        </header>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authen: state.authen
  };
}

NavBar.contextTypes = {
  router: PropTypes.object.isRequired
};

// connecting to redux
export default connect(mapStateToProps, { logout })(NavBar);
