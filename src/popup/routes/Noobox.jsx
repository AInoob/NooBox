import React from "react";
import { withRouter } from "dva/router";
import { LocaleProvider } from "antd";
//redux
import { connect } from "dva";
import reduxActions from "SRC/popup/reduxActions.js";
import reselector from "SRC/popup/reselector.js";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import zh_TW from "antd/lib/locale-provider/zh_TW";
import en_US from "antd/lib/locale-provider/en_US";
import styled from "styled-components";
import FAIcon from "@fortawesome/react-fontawesome";
import faSolid from "@fortawesome/fontawesome-free-solid";
import { Menu } from "antd";
import {
  OVERVIEW_URL,
  HISTORY_URL,
  OPTIONS_URL,
  ABOUT_URL
} from "../../constant/navURL.js";
import { Link, Router, Redirect } from "react-router-dom";

const NooboxContainer = styled.div`
  width: 360px;
  .ant-menu-item {
    text-align: center;
    width: 25%;
    font-size: 14pt;
  }
`;
const locale = {
  "en-US": en_US,
  "zh-CN": zh_CN,
  "zh-TW": zh_TW
};
class Noobox extends React.Component {
  render() {
    const { match, actions } = this.props;
    let i18n = browser.i18n.getUILanguage();
    return (
      <LocaleProvider locale={locale[i18n]}>
        <NooboxContainer>
          {/* <Button type = "danger">Test</Button> */}
          <Menu mode="horizontal" defaultSelectedKeys={[OVERVIEW_URL]}>
            <Menu.Item key={OVERVIEW_URL}>
              <Link to={OVERVIEW_URL}>
                <FAIcon icon={faSolid.faToolbox} />
              </Link>
            </Menu.Item>
            <Menu.Item key={HISTORY_URL}>
              <Link to={HISTORY_URL}>
                <FAIcon icon={faSolid.faHistory} />
              </Link>
            </Menu.Item>
            <Menu.Item key={OPTIONS_URL}>
              <Link to={OPTIONS_URL}>
                <FAIcon icon={faSolid.faCog} />
              </Link>
            </Menu.Item>
            <Menu.Item
              key={ABOUT_URL}
              onOpenChange={() => {
                console.log("test");
              }}
            >
              <Link to={ABOUT_URL}>
                <FAIcon icon={faSolid.faQuestion} />
              </Link>
            </Menu.Item>
          </Menu>
          {this.props.children}
        </NooboxContainer>
      </LocaleProvider>
    );
  }
}
export default withRouter(
  connect(
    reselector,
    reduxActions
  )(Noobox)
);
