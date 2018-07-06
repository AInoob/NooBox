import React,{Component} from 'react';
import {Spin} from 'antd';
import styled from "styled-components";
const LoaderContainer = styled.div`
    height:200px;
    text-align: center;
`;
export default class Loader extends Component{
    render(){
        return ( 
            <LoaderContainer>
                <Spin size="large" />
            </LoaderContainer>
        );
    }
}
