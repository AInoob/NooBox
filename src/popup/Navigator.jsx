//A basic frame of NooBox, including Navigator and holder for children
import React from 'react';
import styled from 'styled-components';

const NavigatorDiv = styled.div`
	width: 413px;
	.header{
		color: ${props => props.color1};
	}
	nav{
		background-color: ${props => props.color1};
		line-height: 36px;
		height: 36px;
		ul{
      li{
        width: 25%;
        a{
          width: 100%;
          padding: initial;
          text-align: center;
        }
      }
		}
	}
`;

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
	componentWillMount() {
		shared.styled = {
			color1: '#7a88e8',
			colorOn: '#26a69a',
		};
	}
  render() {
    const activeList = {};
    activeList[this.props.location] = 'active';
    return(
      <NavigatorDiv color1={shared.styled.color1}>
        <nav>
          <ul>
            <li className={activeList.overview}><a onClick={goTo.bind(null, 'overview')} >{capFirst(GL('overview'))}</a></li>
            <li className={activeList.history}><a onClick={goTo.bind(null, 'history')} >{capFirst(GL('history'))}</a></li>
            <li className={activeList.options}><a onClick={goTo.bind(null, 'options')} >{capFirst(GL('options'))}</a></li>
            <li className={activeList.about}><a onClick={goTo.bind(null, 'about')} >{capFirst(GL('about'))}</a></li>
          </ul>
        </nav>
        <div className="headerPad"></div>
        {this.props.children}
      </NavigatorDiv>
    );
  }
};

export default Navigator;