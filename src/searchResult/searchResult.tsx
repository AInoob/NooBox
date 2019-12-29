import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Content } from './content/content';
import { Header } from './header';
import { SearchResultStore } from './stores/searchResultStore';

interface ISearchResultInjectedProps {
  searchResultStore: SearchResultStore;
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    height: initial;
    background-color: rgb(240, 242, 245);
  }
  body * {
  }
  a {
    color: black;
    text-decoration: none;
  }
  font-family: Helvetica;
  .imageZoomedModal {
    .ant-modal-body {
      text-align: center;
      width: 100%;
    }
  }
`;

const PopupDiv = styled.div`
  font-size: 18px;
  padding: 16px;
`;

@inject('searchResultStore')
@observer
export class SearchResult extends React.Component {
  get injected() {
    return (this.props as any) as ISearchResultInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <PopupDiv>
        <GlobalStyle />
        <Header />
        <Content />
      </PopupDiv>
    );
  }
}
