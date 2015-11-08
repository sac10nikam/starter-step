import React, { PropTypes } from 'react';
import cssifyModules from 'react-css-modules';
const pageStyle = require('./page-container.css');
const gulinkStyle = require('./gulink-container.css');
// import CounterButton from '../../universal/components/CounterButton';
/*
const Sizes = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
};
*/
@cssifyModules(pageStyle)
@cssifyModules(gulinkStyle, { allowMultiple: true })
export default class PageContainer extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  }
  render() {
    return (
      <div styleName="root">
        <div styleName="content">
        { this.props.children }
        </div>
      </div>
    );
  }
}
