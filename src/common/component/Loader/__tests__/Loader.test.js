import React from 'react';
import { shallow } from 'enzyme';
import Loader from '..';

describe('Loader', () => {
  it('render correctly', () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
