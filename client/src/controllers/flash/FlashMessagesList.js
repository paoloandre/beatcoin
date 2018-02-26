import React from "react";
import { connect } from "react-redux";
import FlashMessage from "./FlashMessage";
import PropTypes from "prop-types"; // react prop types are depecrated
import { deleteFlashMessage } from "../../actions/flashMessages";

class FlashMessagesList extends React.Component {
  render() {
    const messages = this.props.messages.map(message => (
      <FlashMessage
        key={message.id}
        message={message}
        deleteFlashMessage={this.props.deleteFlashMessage}
      />
    ));
    return <div>{messages}</div>;
  }
}

FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

// returns only that part of the state that we actually need to output the flash messages
function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  };
}

export default connect(mapStateToProps, { deleteFlashMessage })(
  FlashMessagesList
);
