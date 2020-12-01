import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { BrowserType, browserType } from '../../utils/ua';

const PromoDiv = styled.div`
  text-align: center;
  padding: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 10px 10px 0px;
  #htmlVideoControlStatus {
    cursor: pointer;
  }
  .promo {
    font-size: 13px;
    width: ${chrome ? '33.3%' : '50%'};
    float: left;
    margin: auto;
    overflow: hidden;
    span {
      float: left;
      text-align: left;
    }
    .icon {
      width: 33px;
      height: 33px;
      display: inline-block;
      float: left;
    }
    .icon.mini {
      width: 12px;
      height: 12px;
      margin-left: 3px;
    }
    .qrDiv {
      position: absolute;
      top: 100px;
      left: 0px;
      width: 100%;
      height: 300px;
      display: none;
      .qr {
        width: 300px;
        margin: auto;
      }
    }
  }
`;

export class Promo extends React.Component {
  public render() {
    return (
      <PromoDiv>
        <div className='promo'>
          <a
            target='_blank'
            href='https://play.google.com/store/apps/details?id=com.ainoob.NooBox_Mobile'>
            <div>
              <img className='icon' src={'/images/icon_128.png'} />
              <img className='icon mini' src={'/images/google_play.png'} />
            </div>
            <span>{getI18nMessage('noobox_mobile')}</span>
          </a>
        </div>
        <div className='promo'>
          <a
            target='_blank'
            href='https://play.google.com/store/apps/details?id=com.ainoob.mobile.imagescope'>
            <div>
              <img className='icon' src={'/images/image_scope.jpg'} />
              <img className='icon mini' src={'/images/google_play.png'} />
            </div>
            <span>{getI18nMessage('imageScope_mobile')}</span>
          </a>
        </div>
        {browserType == BrowserType.CHROME && (
          <div className='promo'>
            <a
              target='_blank'
              href='https://chrome.google.com/webstore/detail/img-scope/fmogjofnfmaaifocahboddmmjlehpchi'>
              <div>
                <img className='icon' src={'/images/image_scope.jpg'} />
                <img
                  style={{ height: '25px', width: '60px' }}
                  className='icon mini'
                  src={'/images/chrome_web_store.png'}
                />
              </div>
              <span>{getI18nMessage('imageScope')}</span>
            </a>
          </div>
        )}
      </PromoDiv>
    );
  }
}
