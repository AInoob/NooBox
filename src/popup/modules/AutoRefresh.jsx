import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const AutoRefreshDiv = styled.div`
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
`;

class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      displayHelp: false,
    }
  }
  render() {
    // const help = <p className="important" id="help">{GL('ls_11')}<br/><br/>{GL('ls_12')}<br/><br/>{GL('ls_13')}</p>;
    return (
      <AutoRefreshDiv displayHelp={this.state.displayHelp} className="container">
        <h5 className="header">{GL('autoRefresh')}<span className="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
        <div className="container">
          ...^.^...  On it's way
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="danger">Danger</Button>
        </div>
      </AutoRefreshDiv>
    );
  }
};

export default AutoRefresh;