import React from 'react';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import { Upload } from 'antd';
const Dragger = Upload.Dragger;

export default class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveFile: false,
      fileList: [],
    };
  }
  imageUpload(file) {
    let { imageSearchBegin } = this.props;
    // console.log(file);
    this.getBase64(file, base64 => {
      imageSearchBegin(base64);
    });
  }
  getBase64(file, callBack) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      callBack(this.result);
    };
  }
  render() {
    return (
      <Dragger
        // onChange ={(e)=>this.imageUpload(e)}
        // onChange = {(e)=>this.imageUpload(e)}
        showUploadList={false}
        beforeUpload={file => this.imageUpload(file)}
      >
        <FAIcon className="toolStart" icon={faSolid.faUpload} />
        <p className="ant-upload-text">{i18n('reverse_image_search')}</p>
        <p className="ant-upload-hint">
          {i18n('support_for_a_single_upload')}.
        </p>
      </Dragger>
    );
  }
}
