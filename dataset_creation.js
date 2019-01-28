const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const imageDirectory = path.join(__dirname, 'dataset', 'images', 'tfr')

const rand = (max, min) => Math.floor((Math.random() * max) + min)

// Define possible alphanumeric values
const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'

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
]

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
]


async function shapeRepeat(x, y, settings) {
  const limitX = x + settings.randDimensions
  const limitY = y + settings.randDimensions

  if (limitX < settings.image.bitmap.width && limitY < settings.image.bitmap.height) {
    await rotateRepeat(0, x, y, settings)

    await shapeRepeat(x + 1, y + 1, settings)
  } else {
    return
  }
}

async function rotateRepeat(degrees, x, y, settings) {
  settings.shape
    .rotate(degrees)

  const i = await Jimp.read(settings.imageDirectory + path.sep + settings.imageName)
  
  i
    .composite(settings.shape, x, y)
    .write(`${settings.imageDirectory}/output/${degrees}_${x}_${y}_${settings.imageName}`)

  // exec(`py ${path.join(__dirname, 'tfrecord_gen.py')} --height ${settings.image.bitmap.height} --width ${settings.image.bitmap.width} --filename ${settings.imageName} --image_path ${settings.imageDirectory} --xmins ${x} --xmaxs ${x + settings.randDimensions} --ymins ${y} --ymaxs ${x + settings.randDimensions} --classes_text ${shapes[settings.randShape]} --classes ${settings.randShape}`)

  console.log(`py ${path.join(__dirname, 'tfrecord_gen.py')} --height ${settings.image.bitmap.height} --width ${settings.image.bitmap.width} --filename ${settings.imageName} --image_path ${settings.imageDirectory + path.sep}output --xmins ${x} --xmaxs ${x + settings.randDimensions} --ymins ${y} --ymaxs ${x + settings.randDimensions} --classes_text ${shapes[settings.randShape]} --classes ${settings.randShape}`)

  if (degrees < 360) {
    console.log(degrees)
    await rotateRepeat(degrees + 30, x, y, settings)
  } else {
    return
  }
}

// Loop through images
fs.readdirSync(imageDirectory)
  .map(async (imageName) => {
    try {
      const randLetter = rand(letters.length, 0)
      const randShape = rand(shapes.length, 0)
      const randColor = rand(colors.length, 0)

      // Import a random shape into Jimp
      const shape = await Jimp.read(`./shapes/${shapes[randShape]}.png`)

      // Append a random letter to shape. If light color use black text, otherwise use white.
      let font
      if (randColor > 6) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
      } else {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
      }

      // Random shape size
      const randDimensions = rand(80, 40)

      // Attach a color and letter to the shape image
      shape
        .gaussian(rand(2,1))
        .color(colors[randColor])
        .print(font, shape.bitmap.width / 2, shape.bitmap.height / 2, letters[randLetter])
        .scaleToFit(randDimensions, randDimensions)
  
      // Import image into Jimp
      const image = await Jimp.read(imageDirectory + path.sep + imageName)

      const settings = {
        imageDirectory,
        imageName,
        image,
        randShape,
        randDimensions,
        shape
      }

      await shapeRepeat(0, 0, settings)

      console.log(`Loaded ${imageName}`)
    } catch (error) {
      console.log(error)
    }
  })
