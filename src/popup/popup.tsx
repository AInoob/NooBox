import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { About } from './about';
import { Footer } from './footer';
import { Header } from './header';
import { ImageSearchHistory } from './imageSearchHistory';
import { Options } from './options';
import { Overview } from './overview';
import { RouterStore } from './stores/routerStore';

interface IPopupInjectedProps {
  routerStore: RouterStore;
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    height: initial;
  }
  body * {
  }
  a {
    color: black;
    text-decoration: none;
  }
  font-family: Helvetica;
`;

const PopupDiv = styled.div`
  width: 360px;
  font-size: 18px;
  padding: 4px;
  padding-bottom: 10px;
`;

@inject('routerStore')
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
        {this.getMainContent()}
        <Footer />
      </PopupDiv>
    );
  }

  private getMainContent() {
    const { routerStore } = this.injected;
    const { location } = routerStore;
    if (location === 'overview') {
      return <Overview />;
    } else if (location === 'options') {
      return <Options />;
    } else if (location === 'history') {
      return <ImageSearchHistory />;
    } else {
      return <About />;
    }
  }
}
