import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { getI18nMessage } from '../utils/getI18nMessage';
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
  .ant-popover-content {
    max-width: 300px;
  }
`;

const PopupDiv = styled.div`
  font-size: 18px;
  padding: 16px;
  position: relative;
`;

const FocusPrompt = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 12px 20px;
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  font-size: 14px;
  max-width: calc(100% - 32px);
  text-align: center;
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
    const focusMessage =
      getI18nMessage('focus_google_notification_message') ||
      'NooBox will briefly focus Google to load thumbnails.';
    const { searchResultStore } = this.injected;
    const showFocusPrompt =
      searchResultStore.result.pendingFocus?.google ?? false;
    return (
      <PopupDiv>
        <GlobalStyle />
        {showFocusPrompt && (
          <FocusPrompt role='status' aria-live='polite'>
            {focusMessage}
          </FocusPrompt>
        )}
        <Header />
        <Content />
      </PopupDiv>
    );
  }
}
