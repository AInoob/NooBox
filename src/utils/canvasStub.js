const createContext = () => ({
  measureText: () => ({ width: 0 }),
  fillRect: () => {},
  clearRect: () => {},
  drawImage: () => {},
  fillText: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => ({}),
  setTransform: () => {},
  resetTransform: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {}
});

const createCanvas = (width = 0, height = 0) => ({
  width,
  height,
  getContext: () => createContext(),
  toBuffer: () => Buffer.from(''),
  toDataURL: () => 'data:'
});

const loadImage = async () => ({
  width: 0,
  height: 0,
  src: ''
});

class ImageStub {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.src = '';
  }
}

module.exports = {
  Canvas: createCanvas,
  createCanvas,
  Image: ImageStub,
  loadImage
};
