//A basic frame of NooBox, including Navigator and holder for children
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import styled from 'styled-components';

const PopupDiv = styled.div`
	width: 413px;
	.header{
		color: ${props => props.color1};
	}
	nav{
		background-color: ${props => props.color1};
		line-height: 36px;
		height: 36px;
		ul{
			a{
				padding: 0 26.5px;
			}
		}
	}
	.hidden{
		display: none;
	}
	.line{
		  margin-top: 0.3em;
		  margin-bottom: 0.3em;
	}
	.btn{
		font-size: 0.8rem;
		padding: 0 1rem;
		height: 26px;
		line-height: 26px;
		*{
			cursor: pointer;
		}
	}
	.important{
		color: ${props => props.color1};
		font-size: 1rem;
	}
	.tab-1{
		margin-left: 38px;
	}
	h4{
		margin-top: 0px;
	}
	h5{
		margin-bottom: 3px;
	}
	#helpButton{
		font-size: 1rem;
		cursor: pointer;
	}
	.select-wrapper input.select-dropdown{
		background-color: rgba(255,255,255,0.3);
		padding-left: 17px;
	}
	.select-dropdown{
		color:#26a69a;
	}
`;

module.exports = React.createClass({
	componentWillMount: function() {
		shared.styled = {
			color1: '#7a88e8',
			colorOn: '#26a69a',
		};
	},
  render: function() {
    const activeList = {};
    activeList[(this.props.location.pathname.match(/(\w+)/)||[null,null])[1]]='active'
    return(
      <PopupDiv color1={shared.styled.color1}>
        <nav>
          <ul>
            <li className={activeList.overview}><Link to="/overview">{capFirst(GL('overview'))}</Link></li>
            <li className={activeList.history}><Link to="/history">{capFirst(GL('history'))}</Link></li>
            <li className={activeList.options}><Link to="/options">{capFirst(GL('options'))}</Link></li>
            <li className={activeList.about}><Link to="/about">{capFirst(GL('about'))}</Link></li>
          </ul>
        </nav>
        <div className="headerPad"></div>
        <Helmet
          title="Core"
        />
        {this.props.children}
      </PopupDiv>
    );
  }
});

