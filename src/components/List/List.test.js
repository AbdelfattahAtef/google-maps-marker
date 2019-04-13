import React from 'react';
import List from './index';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

describe('<App />', () => {
    it('Should Render App Component', () => {
        const wrapper = shallow(<List />);
        console.log(wrapper);
        expect(wrapper.length).toBe(1);
    });
    it('matches the snapshot', () => {
        const tree = shallow(<List />);
        expect(toJson(tree)).toMatchSnapshot();
    })
});

//
// expect(wrapper.find('.sidebar__title').length).toBe(1);
// expect(wrapper.find('.sidebar__title').text()).toBe('Select Text Color');
// expect(wrapper.find('.sidebar__section').length).toBe(1);