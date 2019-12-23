import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Upload } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { ImageStore } from '../stores/imageStore';

interface IImageUploadInjectedProps {
  imageStore: ImageStore;
}

interface IImageUploadDivProps {
  inProgress: boolean;
}

const ImageUploadDiv = styled.div`
  position: relative;
  margin: 10px 10px 0px;
  border-radius: 0;
  #uploadIcon {
    cursor: pointer;
    color: ${(p: IImageUploadDivProps) =>
      p.inProgress ? '#40a9ff' : '#495056'};
  }
`;

@inject('imageStore')
@observer
export class ImageUpload extends React.Component {
  get injected() {
    return (this.props as any) as IImageUploadInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { imageStore } = this.injected;
    const { status } = imageStore;
    const { state } = status;
    const inProgress = state === 'inProgress';
    return (
      <ImageUploadDiv inProgress={inProgress}>
        <Upload.Dragger
          disabled={inProgress}
          showUploadList={false}
          beforeUpload={(file) => imageStore.uploadImage(file)}>
          <span id='uploadIcon'>
            <FontAwesomeIcon
              icon={inProgress ? 'sync' : 'upload'}
              size='lg'
              spin={inProgress}
            />
          </span>
          <p className='ant-upload-text'>
            {getI18nMessage('reverse_image_search')}
          </p>
          <p className='ant-upload-hint'>
            {getI18nMessage('support_for_a_single_upload')}.
          </p>
        </Upload.Dragger>
      </ImageUploadDiv>
    );
  }
}
