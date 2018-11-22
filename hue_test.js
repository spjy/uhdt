const Jimp = require('jimp');
const fs = require('fs');
// import path separator based on OS
const { sep } = require('path');

Jimp.read('./Shapes/HalfCircle.jpg')
  .then((img) => {
    return img.color([
      { apply: 'red', params: [255] },
      { apply: 'red', params: [0] },
      { apply: 'red', params: [0] }
    ])
    .write('colored.jpg');
  })