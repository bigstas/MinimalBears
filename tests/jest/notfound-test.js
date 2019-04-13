import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NotFound from '../../client/static/notfound'

configure({ adapter: new Adapter() })

test("There is text in the NotFound page's panel", () => {
  /* Render a checkbox with label in the document
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

  expect(checkbox.text()).toEqual('Off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');*/
    
    const notfound = shallow(<NotFound />)
    expect(notfound.text()).toBeTruthy()
});