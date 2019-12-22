import { Card, Checkbox, Col, Row, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { IOptions } from '../background/options';
import { ENGINE_LIST, getEngineOptionKey } from '../utils/constants';
import { getI18nMessage } from '../utils/getI18nMessage';
import { OptionsStore } from './stores/optionsStore';

interface IOptionsInjectedProps {
  optionsStore: OptionsStore;
}

const OptionsDiv = styled.div`
  padding: 16px;
  padding-left: 24px;
  .option {
    margin-bottom: 4px;
  }
  img {
    width: 35px;
    height: 35px;
  }
  .engineDisabled {
    opacity: 0.2;
  }
`;

@inject('optionsStore')
@observer
export class Options extends React.Component {
  get injected() {
    return (this.props as any) as IOptionsInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <OptionsDiv>
        {this.getCheckBox('autoRefresh', 'auto_refresh', true)}

        {this.getCheckBox('videoControl', 'video_control', true)}

        {this.getCheckBox('history', 'history', true)}

        {this.getCheckBox('imageSearch', 'reverse_image_search', true)}

        {this.getCheckBox('screenshotSearch', 'screenshot_search', true)}

        {this.getEngines()}

        {this.getCheckBox('extractImages', 'extract_images', true)}
      </OptionsDiv>
    );
  }

  private getEngines() {
    const { optionsStore } = this.injected;
    const { options } = optionsStore;
    if (!options.imageSearch && !options.screenshotSearch) {
      return null;
    }
    return (
      <Row gutter={-1}>
        {ENGINE_LIST.map((engine) => {
          const key = getEngineOptionKey(engine) as keyof IOptions;
          return (
            <Col span={6} key={engine}>
              <Tooltip title={getI18nMessage(engine)}>
                <Card bordered={false}>
                  <img
                    src={'images/engineLogos/' + engine + '.png'}
                    onClick={() => optionsStore.update(key, !options[key])}
                    className={options[key] ? '' : 'engineDisabled'}
                  />
                </Card>
              </Tooltip>
            </Col>
          );
        })}
      </Row>
    );
  }

  private getCheckBox(key: keyof IOptions, display: string, newLine?: boolean) {
    const { optionsStore } = this.injected;
    const { options } = optionsStore;
    const checkbox = (
      <Checkbox
        checked={options[key] as boolean}
        onChange={(e) => {
          optionsStore.update(key, e.target.checked).catch(console.error);
        }}>
        {getI18nMessage(display)}
      </Checkbox>
    );
    if (!newLine) {
      return checkbox;
    } else {
      return <div className='option'>{checkbox}</div>;
    }
  }
}
