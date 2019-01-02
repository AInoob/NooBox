import React from "react";
import { Upload } from "antd";
import styled from "styled-components";
import FAIcon from "@fortawesome/react-fontawesome";
import faSolid from "@fortawesome/fontawesome-free-solid";
const H5VideoControlContainer = styled.div`
  .ant-upload-text {
    font-size: 16px;
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.85);
  }
`;
const Dragger = Upload.Dragger;
export default class H5VideoControl extends React.Component {
  render() {
    const { currentState, websiteSwitch } = this.props;
    console.log(this.props.currentState);
    return (
      <H5VideoControlContainer>
        <span>
          <FAIcon
            className={currentState.websiteEnable ? "toolStart" : "toolStop"}
            icon={faSolid.faVideo}
            onClick={() => websiteSwitch()}
          />
        </span>
        <p className="ant-upload-text">{i18n("html_5_video_control")}</p>
        <p className="ant-upload-text">{currentState.hostName}</p>
      </H5VideoControlContainer>
    );
  }
}
