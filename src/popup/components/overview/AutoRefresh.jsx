import React from 'react';
import { Upload, Icon, message, InputNumber, Progress } from 'antd';
import styled from 'styled-components';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import { getCurrentTab, sendMessage } from 'SRC/utils/browserUtils';

const AutoRefreshContainer = styled.div`
  .ant-upload-text {
    font-size: 16px;
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-progress-bg {
    height: 2px !important;
    position: absolute;
    top: -13px;
    left: 0;
  }
  .ant-input-number {
    border-radius: 0;
  }
`;
const Dragger = Upload.Dragger;
export default class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      interval: 3000,
      elapsedTime: 0,
    };
  }

  autoRefreshSwitch() {
    const { autoRefreshUpdate, tabId } = this.props;
    let { active } = this.state;
    autoRefreshUpdate({ tabId, active: !active });
    let newState = {
      active: !active,
    };
    if (active) {
      newState.elapsedTime = 0;
    }
    this.setState(newState, () => {
      this.progressControl();
    });
  }

  progressControl() {
    const { active, animationIntervalId } = this.state;
    if (animationIntervalId) {
      clearInterval(animationIntervalId);
    }
    if (active) {
      let timeId = setInterval(() => {
        let nextElapsedTime = this.state.elapsedTime + 1000;
        if (nextElapsedTime >= this.state.interval - 1) {
          nextElapsedTime = 0;
        }
        this.setState({
          elapsedTime: nextElapsedTime,
        });
      }, 1000);
      this.setState({
        animationIntervalId: timeId,
      });
    }
  }
  componentWillMount() {
    const { currentState } = this.props;

    this.setState(
      {
        active: currentState.ifRefresh,
        interval: currentState.refreshInterval,
        elapsedTime: currentState.refreshElapsed,
      },
      () => {
        this.progressControl();
      },
    );
  }

  componentWillReceiveProps(props) {
    const { currentState } = this.props;
    this.setState({
      active: currentState.ifRefresh,
      interval: currentState.refreshInterval,
      elapsedTime: currentState.refreshElapsed,
    });
  }
  onChangeInterval(newInterval) {
    let { tabId, autoRefreshUpdate } = this.props;
    let { active } = this.state;
    autoRefreshUpdate({ tabId, active, interval: newInterval, startAt: 0 });
    this.setState({
      interval: newInterval,
    });
    if (this.state.active) {
      this.setState(
        {
          elapsedTime: 0,
        },
        () => {
          this.progressControl();
        },
      );
    }
  }
  render() {
    const { elapsedTime, interval, active } = this.state;
    return (
      <AutoRefreshContainer>
        <Progress
          percent={(elapsedTime / (interval - 1000)).toFixed(2) * 100}
          showInfo={false}
        />
        <span onClick={() => this.autoRefreshSwitch()}>
          <FAIcon
            className={active ? 'toolStart' : 'toolStop'}
            icon={faSolid.faSync}
          />
        </span>
        <p className="ant-upload-text">{i18n('auto_refresh')}</p>
        <InputNumber
          defaultValue={interval / 1000}
          min={1}
          formatter={value => `${value}${i18n('s')}`}
          parser={value => value.replace(i18n('s'), '')}
          onChange={v => this.onChangeInterval(v * 1000)}
        />
      </AutoRefreshContainer>
    );
  }
}
