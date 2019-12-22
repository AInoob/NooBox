import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { AutoRefresh } from './overview/autoRefresh';
import { VideoControl } from './overview/videoControl';

const OverviewDiv = styled.div``;

@inject('optionsStore')
@observer
export class Overview extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <OverviewDiv>
        <AutoRefresh />
        <VideoControl />
      </OverviewDiv>
    );
  }
}
