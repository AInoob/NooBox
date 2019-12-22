import { Avatar, Card, List } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../utils/getI18nMessage';

const AboutDiv = styled.div`
  .question {
    font-weight: bold;
  }
  .ant-card {
    margin-bottom: 16px;
  }
`;

const mainContributor = [
  {
    description: getI18nMessage('about_contribution_grorge_description'),
    icon: 'https://avatars0.githubusercontent.com/u/12090689?s=100&v=4',
    link: 'https://github.com/RageCoke1466',
    title: getI18nMessage('about_contribution_george')
  },
  {
    description: getI18nMessage('about_contribution_ainoob_description'),
    icon: 'https://ainoob.com/favicon/apple-icon-120x120.png',
    link: 'https://github.com/AInoob',
    title: getI18nMessage('about_contribution_ainoob')
  }
];

const specialThanks = [
  {
    description: getI18nMessage('about_contribution_zhtw2013_description'),
    icon: 'https://avatars1.githubusercontent.com/u/9501406?s=100&v=4',
    link: 'https://github.com/zhtw2013',
    title: getI18nMessage('about_contribution_zhtw2013')
  }
];

export class About extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <AboutDiv>
        <Card size='small' title={getI18nMessage('about_what')}>
          <h4>{getI18nMessage('about_what_message_0')}</h4>
          <ul>
            <li>{getI18nMessage('about_what_message_1')}</li>
            <li>{getI18nMessage('about_what_message_2')}</li>
            <li>{getI18nMessage('about_what_message_3')}</li>
          </ul>
        </Card>

        <Card size='small' title={getI18nMessage('about_privacy')}>
          <h4>{getI18nMessage('about_what_message_0')}</h4>
          <ul>
            <p className='question'>
              {getI18nMessage('about_privacy_message_0')}
            </p>
            <p>{getI18nMessage('about_privacy_message_1')}</p>

            <p className='question'>
              {getI18nMessage('about_privacy_message_2')}
            </p>
            <p>{getI18nMessage('about_privacy_message_3')}</p>

            <p className='question'>
              {getI18nMessage('about_privacy_message_4')}
            </p>
            <p>{getI18nMessage('about_privacy_message_5')}</p>

            <p className='question'>
              {getI18nMessage('about_privacy_message_6')}
            </p>
            <p>{getI18nMessage('about_privacy_message_7')}</p>
          </ul>
        </Card>

        <Card size='small' title={getI18nMessage('about_??')}>
          <List
            itemLayout='horizontal'
            dataSource={mainContributor}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.icon} />}
                  title={
                    <a target='_blank' href={item.link}>
                      {item.title}
                    </a>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card size='small' title={getI18nMessage('about_contribution')}>
          <List
            itemLayout='horizontal'
            dataSource={specialThanks}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.icon} />}
                  title={
                    <a target='_blank' href={item.link}>
                      {item.title}
                    </a>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card size='small' title={getI18nMessage('about_feedback')}>
          <p>
            <a href='https://github.com/AInoob/NooBox/issues'>
              {getI18nMessage('about_feedback_message')}
            </a>
          </p>
        </Card>
      </AboutDiv>
    );
  }
}
