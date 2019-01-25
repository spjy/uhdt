const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const imageDirectory = path.join(__dirname, 'dataset', 'images', 'tfr');

const rand = (max, min) => Math.floor((Math.random() * max) + min);

// Define possible alphanumeric values
const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';

// Define possible shapes
const shapes = [
  'circle',
  'semicircle',
  'quarter_circle',
  'triangle',
  'square',
  'rectangle',
  'trapezoid',
  'pentagon',
  'hexagon',
  'heptagon',
  'octagon',
  'star',
  'cross',
];

// Red, green, blue, black, white, grey, yellow, purple, brown, orange
const colors = [
  [
    { apply: 'red', params: [255] },
    { apply: 'green', params: [0] },
    { apply: 'blue', params: [0] }
  ],
  [
    { apply: 'red', params: [0] },
    { apply: 'green', params: [255] },
    { apply: 'blue', params: [0] }
  ],
  [
    { apply: 'red', params: [0] },
    { apply: 'green', params: [0] },
    { apply: 'blue', params: [255] }
  ],
  [
    { apply: 'red', params: [128] },
    { apply: 'green', params: [0] },
    { apply: 'blue', params: [128] }
  ],
  [
    { apply: 'red', params: [165] },
    { apply: 'green', params: [42] },
    { apply: 'blue', params: [42] }
  ],
  [
    { apply: 'red', params: [255] },
    { apply: 'green', params: [165] },
    { apply: 'blue', params: [0] }
  ],
  [
    { apply: 'red', params: [0] },
    { apply: 'green', params: [0] },
    { apply: 'blue', params: [0] }
  ],
  [
    { apply: 'red', params: [255] },
    { apply: 'green', params: [255] },
    { apply: 'blue', params: [255] }
  ],
  [
    { apply: 'red', params: [128] },
    { apply: 'green', params: [128] },
    { apply: 'blue', params: [128] }
  ],
  [
    { apply: 'red', params: [255] },
    { apply: 'green', params: [255] },
    { apply: 'blue', params: [0] }
  ],
];

// Loop through images
fs.readdirSync(imageDirectory)
  .map(async (imageName) => {
    try {
      const randLetter = rand(letters.length, 0);
      const randShape = rand(shapes.length, 0);
      const randColor = rand(colors.length, 0);

      // Import a random shape into Jimp
      const shape = await Jimp.read(`./shapes/${shapes[randShape]}.png`);

      // Append a random letter to shape. If light color use black text, otherwise use white.
      let font;
      if (randColor > 6) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      } else {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      }

      // Random shape size
      const randDimensions = rand(80, 40);

      // Attach a color and letter to the shape image
  
      // Import image into Jimp
      const image = await Jimp.read(imageDirectory + path.sep + imageName);
      console.log(`Loaded ${imageName}`)

      ;(function shapeRepeat(x, y) {
        const limitX = x + randDimensions;
        const limitY = y + randDimensions;

        if (limitX < image.bitmap.width && limitY < image.bitmap.height) {
          ;(function rotateRepeat(degrees) {
            console.log(degrees)

            shape
              .gaussian(rand(2,1))
              .color(colors[randColor])
              .print(font, shape.bitmap.width / 2, shape.bitmap.height / 2, letters[randLetter])
              .scaleToFit(randDimensions, randDimensions)
              .rotate(degrees);

            image
              .composite(shape, x, y)
              .write(`${imageDirectory}/output/${imageName.split('.')[0]}_${x}_${y}_${degrees}.JPG`)

            exec(`py ${path.join(__dirname, 'tfrecord_gen.py')} --height ${image.bitmap.height} --width ${image.bitmap.width} --filename ${imageName} --image_path ${imageDirectory} --xmins ${x} --xmaxs ${x + randDimensions} --ymins ${y} --ymaxs ${x + randDimensions} --classes_text ${shapes[randShape]} --classes ${randShape}`)

            console.log(`py ${path.join(__dirname, 'tfrecord_gen.py')} --height ${image.bitmap.height} --width ${image.bitmap.width} --filename ${imageName} --image_path ${imageDirectory + path.sep}output --xmins ${x} --xmaxs ${x + randDimensions} --ymins ${y} --ymaxs ${x + randDimensions} --classes_text ${shapes[randShape]} --classes ${randShape}`)

            console.log(degrees)
            if (degrees < 360) {

              return rotateRepeat(degrees + 0.5)
            } else {
              return;
            }
          })(0)

          return shapeRepeat(x + 1, y + 1);
        } else {
          return;
        }
      })(0, 0)
    } catch (error) {
      console.log(error);
    }
  });
