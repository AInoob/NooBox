import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { EngineType, getEngineImageUrl } from '../../utils/constants';
import {
  EngineStatusType,
  SearchResultStore
} from '../stores/searchResultStore';

interface IEngineProps {
  engine: EngineType;
}

interface IEngineInjectedProps {
  searchResultStore: SearchResultStore;
}

interface IEngineDivProps {
  status: EngineStatusType;
}

const EngineDiv = styled.div`
  background-color: ${(p: IEngineDivProps) =>
    p.status === 'error' ? '#ff000021;' : 'initial;'};
  position: relative;
  width: 12.5%;
  float: left;
  a {
    display: block;
    width: 100%;
    padding: 16px;
    box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8,
      1px 0 0 0 #e8e8e8 inset, 0 1px 0 0 #e8e8e8 inset;
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: 0.3s;
    }
  }
  img {
    width: 100%;
  }
  .ant-spin {
    display: ${(p: IEngineDivProps) =>
      p.status === 'loading' ? 'inline-block;' : 'none;'}
    position: absolute;
    width: 100%;
    padding-top: 100%
    .ant-spin-dot {
      height: 30px;
      width: 30px;
      position: absolute;
      left: 50%;
      margin-left: -15px;
      top: 50%;
      margin-top: -15px;
    }
  }
  ${(p: IEngineDivProps) => {
    if (p.status !== 'loaded') {
      return `
        a {
          cursor: initial;
        }
        img {
          opacity: 0.2333;
        }
      `;
    }
    return ``;
  }}
`;

@inject('searchResultStore')
@observer
export class Engine extends React.Component<IEngineProps> {
  get injected() {
    return (this.props as any) as IEngineInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { engine } = this.props;
    const { searchResultStore } = this.injected;
    const { result } = searchResultStore;
    const link = result.engineLink ? result.engineLink[engine] : '';
    let status: EngineStatusType = 'disabled';
    if (result.engineStatus) {
      if (
        result.engineStatus[engine] != null &&
        result.engineStatus[engine] != null
      ) {
        status = result.engineStatus[engine]!;
      }
    } else if ((result.engineLink || {})[engine]) {
      // if it's using legacy structure
      // @ts-ignore
      status = result[engine + 'Done'] ? 'loaded' : 'loading';
    }
    return (
      <EngineDiv status={status}>
        <Spin />
        <a href={link} target='_blank'>
          <img alt='engineIcon' src={getEngineImageUrl(engine)} />
        </a>
      </EngineDiv>
    );
  }
}
