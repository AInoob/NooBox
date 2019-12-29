import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { EngineType, getEngineImageUrl } from '../../utils/constants';
import { SearchResultStore } from '../stores/searchResultStore';

interface IEngineProps {
  engine: EngineType;
}

interface IEngineInjectedProps {
  searchResultStore: SearchResultStore;
}

const EngineDiv = styled.div`
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
    return (
      <EngineDiv>
        <a href={link} target='_blank'>
          <img src={getEngineImageUrl(engine)} />
        </a>
      </EngineDiv>
    );
  }
}
