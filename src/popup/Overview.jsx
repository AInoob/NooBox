import React from 'react';
import Helmet from 'react-helmet';
import Module from './Module.jsx';
import styled from 'styled-components';

const OverviewDiv = styled.div`
	.module{
		clear:both;
	}
	#icons{
		img{
			width: 40px;
			margin-right:4px;
		}
	}
	#imageUpload,#uploadedImage{
		display:none;
	}
	#info{
		#imageUploadLabel{
			color: white;
			display: block;
		}
	}
`;

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules:[]
    };
  }
  componentDidMount() {
    this.getInitialData();
  }
  getInitialData() {
    get('displayList', (modules) => {
      this.setState({modules:modules});
    });
  }
  render() {
    const modules = this.state.modules.map((elem, index) => {
      return <Module key={index} name={elem} />
    });
    return (
			<OverviewDiv colorOn={shared.styled.colorOn}>
				{modules}
			</OverviewDiv>
		);
  }
};

export default Overview;