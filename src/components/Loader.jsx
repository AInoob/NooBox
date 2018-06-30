import React,{Component} from 'react';
import {Spin} from 'antd';

export default class Loader extends Component{

    render(){
        return (    
                <Spin size="large" />
        );
    }
}
