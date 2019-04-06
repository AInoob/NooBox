require('@babel/polyfill');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
if (typeof window !== 'undefined') {
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(new Event('resize'));
  };
  global.window.scrollTo = () => {};
}

// The built-in requestAnimationFrame and
// cancelAnimationFrame not working with jest.runFakeTimes()
// https://github.com/facebook/jest/issues/5147
global.requestAnimationFrame = function(cb) {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = function(cb) {
  return clearTimeout(cb, 0);
};

Enzyme.configure({ adapter: new Adapter() });
