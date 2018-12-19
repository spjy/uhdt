const Jimp = require('jimp');
const fs = require('fs');
const { sep } = require('path');

const imageDirectory = `.${sep}dataset${sep}images${sep}test`;

// Generate random number with max and min values
const rand = (max, min) => Math.floor((Math.random() * max) + min);

// Loop through images
fs.readdirSync(imageDirectory)
  .map(async (imageName) => {
    try {
      // Define possible alphanumeric values
      const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';

      // Define possible shapes
      const shapes = [
        // 'HalfCircle',
        // 'Heptagon',
        // 'Hexagon',
        // 'Octagon',
        // 'Pentagon',
        // 'QuarterCircle',
        // 'Rectangle',
        'Square',
        'Star',
        // 'Trapezoid',
        // 'Triangle',
        // 'Circle'
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

      const randScaleToFit = rand(70, 50);

      // Attach a color and letter to the shape image
      shape
        .gaussian(rand(6,1))
        .color(colors[randColor])
        .print(font, shape.bitmap.width / 2, shape.bitmap.height / 2, letters[randLetter])
        .rotate(rand(360, 0))
        .scaleToFit(randScaleToFit, randScaleToFit);
  
      // Import image into Jimp
      const image = await Jimp.read(imageDirectory + sep + imageName);
      console.log(`Loaded ${imageName}`)
  
      // Random x and y values within the 0 to width and height of image
      const x = rand(image.bitmap.width, 1);
      const y = rand(image.bitmap.height, 1);
  
      // Append shape to image
      return image
        .composite(shape, x - (randScaleToFit + 10), y - (randScaleToFit + 10)) // Append shape, prevent from going outside of image
        .write(`${imageDirectory}/output/${imageName}_with_target1.jpg`);

    } catch (error) {
      console.log(error);
    }
  });
