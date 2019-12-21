import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

interface IHeaderInjectedProps {}

const HeaderDiv = styled.div`
  padding: 4px;
  margin-bottom: 8px;
  &:hover {
    box-shadow: 0px 0px 3px;
  }
  #avatar {
    width: 23px;
    height: 23px;
    margin-bottom: -3px;
  }
  #name {
    margin-left: 8px;
    font-size: 23px;
    font-weight: bold;
  }
  #followersCount {
    margin-left: 16px;
    font-size: 18px;
    font-weight: bold;
  }
  #reload {
    float: right;
    margin-right: 8px;
    cursor: pointer;
    margin-top: 3px;
    &.loading {
      cursor: initial;
      opacity: 0.3;
    }
  }
`;

@inject()
@observer
export class Header extends React.Component {
  get injected() {
    return (this.props as any) as IHeaderInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    return <HeaderDiv></HeaderDiv>;
  }
}
