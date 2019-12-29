import { Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { ActionBar } from './header/actionBar';
import { Brief } from './header/brief';
import { EngineList } from './header/engineList';

const HeaderDiv = styled.div`
  .ant-col-12 {
    background: white;
  }
`;

@inject('searchResultStore')
@observer
export class Header extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <HeaderDiv>
        <Row type='flex'>
          <Col span={4} />
          <Col span={4}>
            <Brief />
          </Col>
          <Col span={12}>
            <EngineList />
            <ActionBar />
          </Col>
          <Col span={4}></Col>
        </Row>
      </HeaderDiv>
    );
  }
}
