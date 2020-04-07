import * as React from 'react';
import styled from 'styled-components';

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
    width: 50px;
    margin: auto;
    overflow: hidden;
    .icon {
      width: 33px;
      height: 33px;
      display: block;
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
    &:hover {
      .qrDiv {
        display: block;
      }
      height: 500px;
    }
  }
`;

export class Promo extends React.Component {
  public render() {
    return (
      <PromoDiv>
        <div className='promo'>
          <img className='icon' src={'/images/google_play.png'} />
          <div className='qrDiv'>
            <img className='qr' src={'/images/google_play_qr.png'} />
          </div>
        </div>
      </PromoDiv>
    );
  }
}
