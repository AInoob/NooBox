import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { LocationType, RouterStore } from './stores/routerStore';

interface IHeaderInjectedProps {
  routerStore: RouterStore;
}

const HeaderDiv = styled.div`
  .ant-menu-item {
    width: 25%;
    text-align: center;
  }
`;

@inject('routerStore')
@observer
export class Header extends React.Component {
  get injected() {
    return (this.props as any) as IHeaderInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { routerStore } = this.injected;
    const { location } = routerStore;
    return (
      <HeaderDiv>
        <Menu mode='horizontal' selectedKeys={[location]}>
          {this.getMenuItem('overview', 'toolbox')}
          {this.getMenuItem('history', 'history')}
          {this.getMenuItem('options', 'cog')}
          {this.getMenuItem('about', 'question')}
        </Menu>
      </HeaderDiv>
    );
  }

  private getMenuItem(location: LocationType, faIcon: IconProp) {
    const { routerStore } = this.injected;
    return (
      <Menu.Item
        key={location}
        onClick={() => {
          routerStore.goTo(location);
        }}>
        <a>
          <FontAwesomeIcon icon={faIcon} size={'lg'} />
        </a>
      </Menu.Item>
    );
  }
}
