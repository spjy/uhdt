from PIL import Image, ImageColor, ImagePalette, ImageFilter, ImageDraw, ImageFont, ImageOps
import os
import subprocess
import numpy as np

letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'

shapes = (
  # 'circle',
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
)

colors = (
  (255, 0, 0), # Red
  (0, 255, 0), # Green
  (128, 0, 128), # Purple
  (165, 42, 42), # Dark Red
  (255, 165, 0), # Orange
  (0, 0, 0), # Black
  (255, 255, 255), # White
  (128, 128, 128), # Grey
  (255, 255, 0) # Yellow
)


def __convertShapeColor(shape, rgb):
  data = np.array(shape)

  r1, g1, b1 = 0, 0, 0 # Original RGB value
  r2, g2, b2 = rgb[0], rgb[1], rgb[2] # RGB value that we want to replace iwith

  red, green, blue = data[:,:,0], data[:,:,1], data[:,:,2]
  mask = (red == r1) & (green == g1) & (blue == b1)
  data[:,:,:3][mask] = [r2, g2, b2]

  return Image.fromarray(data)

def __rotateRepeat(x, y, image, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter, degrees):
  copy = image.copy() # Retain original image

  rotatedShape = shape.rotate(degrees, resample=Image.BICUBIC, expand=True).filter(ImageFilter.GaussianBlur(1.2)) # Rotate and apply Gaussian blur

  image.paste(rotatedShape, (x, y), None if shapeClass == 4 else rotatedShape) # Combine shape into image, add mask if not square
  filename = f'{color[0]}_{color[1]}_{color[2]}_{letter}_{degrees}_{x}_{y}_{imageName}'
  image.save(path.join(imagePath, 'output', filename)) # Save image

  xmin = x
  xmax = x + rotatedShape.width
  ymin = y
  ymax = y + rotatedShape.height

  # image.crop((xmin, ymin, xmax, ymax)).show()

  os.system('py tfrecord_gen.py --height %s --width %s --filename %s --image_path %s --xmins %s --xmaxs %s --ymins %s --ymaxs %s --classes_text %s --classes %s' % (image.height, image.width, filename, path.join(imagePath, 'output'), xmin / image.width, xmax / image.width, ymin / image.height, ymax / image.height, shapes[shapeClass], shapeClass))

  print('py tfrecord_gen.py --height %s --width %s --filename %s --image_path %s --xmins %s --xmaxs %s --ymins %s --ymaxs %s --classes_text %s --classes %s' % (image.height, image.width, filename, path.join(imagePath, 'output'), xmin / image.width, xmax / image.width, ymin / image.height, ymax / image.height, shapes[shapeClass], shapeClass))

  if (degrees < 360):
    print(degrees)
    return __rotateRepeat(x, y, copy, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter, degrees + 1)
  else:
    return copy

def __repeatShape(x, y, image, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter) :
  limitX = x + shape.width
  limitY = y + shape.height

  if (limitX < image.width and limitY < image.height):
    # if (shapeClass != 0): # Exclude circle
    rawImage = __rotateRepeat(x, y, image, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter, 0)

    if (limitX < image.width):
      print('is', limitX, limitY, image.width, image.height)
      return __repeatShape(x + 1, y, rawImage, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter)
    elif (not limitX < image.width):
      print('not', limitX, limitY, image.width, image.height)
      return __repeatShape(0, y + 1, rawImage, imageName, imagePath, shape, shapeDimensions, shapeClass, color, letter)
  else:
    return

path = os.path
__cwd = os.getcwd()
imageDirectory = path.join(__cwd, 'dataset', 'images', 'tfr')

for filename in os.listdir(imageDirectory):
  # Loop through the directory containing scenic images
  image = Image.open(path.join(imageDirectory, filename)) # Image with scene

  for shapeClass in range(len(shapes)):
    shape = Image.open(path.join(__cwd, 'shapes', shapes[shapeClass] + '.png')) # Load image of shape
    expandedShape = ImageOps.expand(shape, 10) # Expand border of image to allow proper blurring

    for shapeDimensions in range(80, 150):
      expandedShape.thumbnail([shapeDimensions, shapeDimensions]) # Scale down image

      for color in colors:
        coloredShape = __convertShapeColor(expandedShape, color) # Color image

        for letter in letters:
          # Load font and draw letter on shape
          draw = ImageDraw.Draw(coloredShape)
          fontSize = 20
          font = ImageFont.truetype('ARIALNB.TTF', size=fontSize)
          draw.text(((coloredShape.width / 2) - (fontSize / 4) - 1, (coloredShape.height / 2) - (fontSize / 2)), letter, font=font, fill=(255, 255, 0, 255)) # Draw letter

          # image.paste(coloredShape.filter(ImageFilter.GaussianBlur(1.2)), (1000, 1000), coloredShape.filter(ImageFilter.GaussianBlur(1.2)))

          # image.show()

          __repeatShape(0, 0, image, filename, imageDirectory, coloredShape, shapeDimensions, shapeClass, color, letter)
