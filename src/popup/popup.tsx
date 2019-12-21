import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Footer } from './footer';
import { Header } from './header';

interface IPopupInjectedProps {}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  body * {
    transition: all 0.318s ease;
  }
  a {
    color: black;
    text-decoration: none;
  }
  font-family: Helvetica;
`;

const PopupDiv = styled.div`
  font-size: 18px;
  width: 600px;
  min-height: 600px;
  padding: 4px;
`;

@inject()
@observer
export class Popup extends React.Component {
  get injected() {
    return (this.props as any) as IPopupInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <PopupDiv>
        <GlobalStyle />
        <Header />
        <Footer />
      </PopupDiv>
    );
  }
}
