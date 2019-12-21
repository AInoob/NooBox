import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

interface IFooterInjectedProps {}

const FooterDiv = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  height: 31px;
  #footerMenu {
    padding: 4px;
    a {
      text-transform: capitalize;
      padding: 2px;
      width: calc(50% - 45px);
      display: inline-block;
      text-align: center;
      font-weight: bold;
      color: white;
      background-color: #747474;
      &:hover {
        box-shadow: 0px 0px 3px #828282;
        background-color: black;
      }
      &.active {
        background-color: black;
      }
      & + a {
        margin-left: 8px;
      }
    }
    #donate {
      width: 21px;
      height: 21px;
      &:hover #donateSection {
        display: block;
      }
      #donateSection {
        display: none;
        position: absolute;
        top: -500px;
        left: -4px;
        height: 500px;
        width: 608px;
        background-color: rgba(0, 0, 0, 0.5);
        img {
          margin-top: 100px;
          width: 300px;
          height: 300px;
        }
      }
    }
    #contribute {
      width: 21px;
      height: 21px;
    }
  }
`;

@inject()
@observer
export class Footer extends React.Component {
  get injected() {
    return (this.props as any) as IFooterInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <FooterDiv>
        <div id='footerMenu'>
          <a href='#'></a>
          <a href='#'>
            <span id='name'></span>
          </a>
          <a
            id='contribute'
            target='_blank'
            href='https://github.com/AInoob/ZhihuFollowerCleaner'>
            <FontAwesomeIcon icon={['fab', 'github']} />
          </a>
          <a id='donate' href='#'>
            <FontAwesomeIcon icon='donate' />
            <div id='donateSection'>
              <img src='/images/donate.png' alt='donate' />
            </div>
          </a>
        </div>
      </FooterDiv>
    );
  }
}
