import React from 'react';
//Unused import
import Helmet from 'react-helmet';
import { Link } from 'react-router';
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


module.exports = React.createClass({
    displayName: 'Overview',

    //React Method
    getInitialState(){
        return {modules:[]};
    },

    //React Method
    componentDidMount (){

        //Need another time to figure out what hell is this
        shared.goTo = this.props.router.push;

        //Check the whether the URL contain the popup
        if(window.location.pathname.indexOf('popup')!=-1){
            const page = getParameterByName('page');

            if(page){
                //check if the page is overview
                this.props.router.push(page);
                if(page == 'overview') {
                    this.getInitialData();
                }
            }else{
                // window.get method in the /js/util.js
                window.get('defaultPage', (url) => {
                    this.props.router.push(( url || 'overview' ) );
                    if( !url || url == 'overview' ){
                        this.getInitialData();
                    }
                });
            }

        }else{
            this.getInitialData();
        }
    },

    //Self define method
    getInitialData(){
        get('displayList', (modules) => {
            this.setState({modules:modules});
        });
    },

    //React method
    render(){
        const modules = this.state.modules.map((elem, index) => {
            return <Module key={index} name={elem} />
        });
        return (
            <OverviewDiv colorOn={shared.styled.colorOn}>
                {modules}
            </OverviewDiv>
        );
    }
});
