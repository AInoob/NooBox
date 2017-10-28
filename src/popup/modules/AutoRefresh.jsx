import React from 'react';
import styled from 'styled-components';

const AutoRefreshDiv = styled.div`
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
`;

module.exports = React.createClass({
  displayName: 'AutoRefresh',
  reader : new window.FileReader(),
  getInitialState: function() {
    return { enabled: false, displayHelp: false };
  },
  componentDidMount: function() {
  },
  render: function() {
    // const help = <p className="important" id="help">{GL('ls_11')}<br/><br/>{GL('ls_12')}<br/><br/>{GL('ls_13')}</p>;
    return (
      <AutoRefreshDiv displayHelp={this.state.displayHelp} className="container">
        <h5 className="header">{GL('autoRefresh')}<span id="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
            ^.^
        <div id="info" className="container">
        </div>
      </AutoRefreshDiv>
    );
  }
});
