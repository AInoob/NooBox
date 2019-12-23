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
  text-align: center;
  padding-bottom: 12px;
  padding-top: 12px;
  position: relative;
  margin: 10px 10px 0px;
  border-width: 1px;
  border-style: dashed;
  border-color: rgb(217, 217, 217);
  border-image: initial;
  background: rgb(250, 250, 250);
  #htmlVideoControlStatus {
    cursor: pointer;
    color: ${(p: IVideoControlDivProps) => (p.active ? '#40a9ff' : '#495056')};
  }
  span {
    display: block;
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
        <span
          id='htmlVideoControlStatus'
          onClick={() => videoControlStore.toggle().catch(console.error)}>
          <FontAwesomeIcon icon='video' size='lg' />
        </span>
        <span>{getI18nMessage('html_5_video_control')}</span>
        <span>{hostname}</span>
      </VideoControlDiv>
    );
  }
}
