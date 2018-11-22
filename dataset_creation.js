const Jimp = require('jimp');
const fs = require('fs');
// import path separator based on OS
const { sep } = require('path');

const imageDirectory = `./dataset/images/test`;

// Loop through images
fs.readdirSync(imageDirectory)
  .map(async (imageName) => {
    try {
      // Define possible shapes
      const shapes = [
        'HalfCircle',
        'Heptagon',
        'Hexagon',
        'Octagon',
        'Pentagon',
        'QuarterCircle',
        'Rectangle',
        'Star',
        'Trapezoid',
        'Triangle',
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
      ];

      const randShape = Math.floor((Math.random() * shapes.length));
      const randColor = Math.floor((Math.random() * colors.length));

      // Import a random shape into Jimp
      const shape = await Jimp.read(`./Shapes/${shapes[randShape]}.jpg`);

      // Append a random letter to shape
      const font = await Jimp.loadFont(Jimp.FONT_SANS_14_BLACK);

      // Attach a color and letter to the shape image
      shape
        .color(colors[randColor])
        .print(font, 0, 0);
  
      // Import image into Jimp
      const image = await Jimp.read(imageDirectory + sep + imageName);
  
      // Random x and y values within the 0 to width and height of image
      const x = Math.floor((Math.random() * image.bitmap.width) + 1);
      const y = Math.floor((Math.random() * image.bitmap.height) + 1);
  
      // Append shape to image
      return image
        .composite(shape, x, y)
        .write(`${imageName}_with_target.jpg`);

    } catch (error) {
      console.log(error);
    }
  });
