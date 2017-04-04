import 'jest-enzyme';

// https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
// Make Enzyme functions available in all test files without importing
import { shallow, render, mount } from 'enzyme';
global.shallow = shallow;
global.render = render;
global.mount = mount;

// Fail tests on any warning
console.error = message => { // eslint-disable-line no-console
  throw new Error(message);
};
