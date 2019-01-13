import React from 'react';
import {
  Card,
  Spin,
} from 'antd';
import google from 'SRC/assets/engineLogos/google.png';
import baidu from 'SRC/assets/engineLogos/baidu.png';
import ascii2d from 'SRC/assets/engineLogos/ascii2d.png';
import bing from 'SRC/assets/engineLogos/bing.png';
import saucenao from 'SRC/assets/engineLogos/saucenao.png';
import tineye from 'SRC/assets/engineLogos/tineye.png';
import iqdb from 'SRC/assets/engineLogos/iqdb.png';
import yandex from 'SRC/assets/engineLogos/yandex.png';
import './assets/Engine.css'
const gridStyle = {
  width: '12.5%',
  padding: 0,
  textAlign: 'center',
  cursor: 'pointer',
};
const gridOptions = [
  { keys: ['google', 'googleDone'], src: google },
  { keys: ['baidu', 'baiduDone'], src: baidu },
  { keys: ['yandex', 'yandexDone'], src: yandex },
  { keys: ['bing', 'bingDone'], src: bing },
  { keys: ['tineye', 'tineyeDone'], src: tineye },
  { keys: ['saucenao', 'saucenaoDone'], src: saucenao },
  { keys: ['iqdb', 'iqdbDone'], src: iqdb },
  { keys: ['ascii2d', 'ascii2dDone'], src: ascii2d },
]

export default class Engine extends React.Component {
  handleGridClick = item => {
    const [type] = item.keys;
  }

  render() {
    const { engineLink } = this.props;
    return (
      <Card bordered={false}>
        {gridOptions.map((item, i) => {
          const [type, done] = item.keys;
          return (
            <Card.Grid style={gridStyle} key={`engine-card-grid-${i}`} onClick={() => this.handleGridClick(item)}>
              <div className="box">
                <div className="engineContainer">
                  <Spin
                    className={
                      !this.props[type] || this.props[done]
                        ? 'engineLoadingDone'
                        : 'engineLoading'
                    }
                    type="loading"
                  />
                  <a href={engineLink[type]} target="_blank" rel="noopener noreferrer">
                    <img
                      alt=""
                      className={
                        this.props[type]
                          ? this.props[done]
                            ? 'engineImage'
                            : 'engineImageLoading'
                          : 'engineImageHide'
                      }
                      src={item.src}
                    />
                  </a>
                </div>
              </div>
            </Card.Grid>
          )
        })}
      </Card>
    );
  }
}
