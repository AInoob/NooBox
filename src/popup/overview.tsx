import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { OptionsStore } from '../shared/stores/optionsStore';
import { AutoRefresh } from './overview/autoRefresh';
import { ImageUpload } from './overview/imageUpload';
import { Promo } from './overview/promo';
import { VideoControl } from './overview/videoControl';

interface IOverviewInjectedProps {
  optionsStore: OptionsStore;
}

const OverviewDiv = styled.div``;

@inject('optionsStore')
@observer
export class Overview extends React.Component {
  get injected() {
    return (this.props as any) as IOverviewInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { optionsStore } = this.injected;
    const { options } = optionsStore;
    const { autoRefresh, imageSearch, videoControl } = options;
    return (
      <OverviewDiv>
        {imageSearch && <ImageUpload />}
        {autoRefresh && <AutoRefresh />}
        {videoControl && <VideoControl />}
        <Promo />
      </OverviewDiv>
    );
  }
}