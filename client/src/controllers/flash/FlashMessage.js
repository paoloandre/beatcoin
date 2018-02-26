import React from "react";
import ContentClear from "material-ui/svg-icons/content/clear";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { deleteFlashMessage } from "../../actions/flashMessages";

class FlashMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, type } = this.props;

    return <div>{text}</div>;
  }
}

function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  };
}

export default connect(mapStateToProps)(FlashMessage);
