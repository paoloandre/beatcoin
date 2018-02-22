import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types"; // react prop types are depecrated

export default function(PassedComponent) {
  // takes the passed component and englobes in another one
  // the way to hack this would be pretty simple, assuming that anyone is able to manage to force a change in the redux state
  // or simply ignore completely, and go through postman for example

  class Authenticate extends React.Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.context.router.history.push("/");
      }
    }

    // ... this.props means that the props of the PassedComponent stay the same
    // if the component HAPPEN, and i repeat HAPPEN to have props to pass down the tree, it would pass them
    // but since our app is made out of components, the tree doesn't really go deeper than that
    // except in the navbar that goes deeper by one lvl, LoginDialog and has one child which is User Sign Up
    // but there are no props we need to pass from LoginDialog to User Sign Up, so the only one remaining
    // is from NavBar to LoginDialog, which also in this case, only acts as a container
    render() {
      return <PassedComponent {...this.props} />;
    }
  }

  Authenticate.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.authen.isAuthenticated
    };
  }

  Authenticate.contextTypes = {
    router: PropTypes.object.isRequired
  };

  return connect(mapStateToProps)(Authenticate);
}
