import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { VideoControlStore } from '../stores/videoControlStore';

interface IVideoControlInjectedProps {
  videoControlStore: VideoControlStore;
}

interface IVideoControlDivProps {
  active: boolean;
}

const VideoControlDiv = styled.div`
  #htmlVideoControlStatus {
    cursor: pointer;
    color: ${(p: IVideoControlDivProps) => (p.active ? '#40a9ff' : '#495056')};
  }
`;

@inject('videoControlStore')
@observer
export class VideoControl extends React.Component {
  get injected() {
    return (this.props as any) as IVideoControlInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { videoControlStore } = this.injected;
    const { active, hostname } = videoControlStore;
    return (
      <VideoControlDiv active={active}>
        <p id='autoRefreshHeader'>{getI18nMessage('html_5_video_control')}</p>
        <span
          id='htmlVideoControlStatus'
          onClick={() => videoControlStore.toggle().catch(console.error)}>
          <FontAwesomeIcon icon='video' />
        </span>
        <p>{hostname}</p>
      </VideoControlDiv>
    );
  }
}
