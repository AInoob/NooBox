import React from 'react';
import styled from 'styled-components';
import { Steps } from 'antd';
const Step = Steps.Step;

const AutoRefreshDiv = styled.div`
	#help{
		height: ${props => props.displayHelp ? 'initial' : '0px'};
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
    if (!this.state.enabled) {
      return null;
    }
    // const help = <p className="important" id="help">{GL('ls_11')}<br/><br/>{GL('ls_12')}<br/><br/>{GL('ls_13')}</p>;
    return (
      <AutoRefreshDiv displayHelp={this.state.displayHelp} className="container">

        <h5 className="header">

          {GL('autoRefresh')}

          <span className="helpButton" onClick={() => { this.setState({ displayHelp: !this.state.displayHelp }) }}>

            &nbsp;(?)
          </span>

          <Steps current={1}>
            <Step title="Starting Project" description="Start" />
            <Step title="In Progress" description="Comming Soon" />
          </Steps>

        </h5>

        <div className="container">

        </div>
      </AutoRefreshDiv>
    );
  }
};

export default AutoRefresh;