import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { ENGINE_LIST } from '../../utils/constants';
import { SearchResultStore } from '../stores/searchResultStore';
import { Engine } from './engine';

interface IEngineListInjectedProps {
  searchResultStore: SearchResultStore;
}

const EngineListDiv = styled.div`
  overflow: hidden;
  padding: 12px;
`;

@inject('searchResultStore')
@observer
export class EngineList extends React.Component {
  get injected() {
    return (this.props as any) as IEngineListInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <EngineListDiv>
        {ENGINE_LIST.map((engine) => {
          return <Engine engine={engine} key={engine} />;
        })}
      </EngineListDiv>
    );
  }
}
