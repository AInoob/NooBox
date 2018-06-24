import React from "react";
import { Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;

export default class UploadImage extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      haveFile:false,
      fileList:[],
    }
  }
  imageUpload(e){
    this.getBase64(e.file.originFileObj,(base64)=>{
      this.setState({base64:base64});
    })
  }
  getBase64(file,callBack){
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      callBack(this.result);
    }
  }
  render(){
      return(
        <Dragger 
          // onChange ={(e)=>this.imageUpload(e)}
          onChange = {(e)=>this.onChange(e)}
          showUploadList = {false}
        >
           <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Reverse Image Search</p>
          <p className="ant-upload-hint">Support for a single upload.</p>
        </Dragger>
      ); 
  }
}