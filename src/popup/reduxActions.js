import { bindActionCreators } from 'redux';
import * as actions from 'SRC/popup/actions.js';

export default function reduxActions(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}
