from PIL import Image, ImageColor, ImagePalette, ImageFilter, ImageDraw, ImageFont
import os
import numpy as np

letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'

shapes = (
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

def __rotateRepeat(x, y, image, imageName, shape, degrees):
  copy = image.copy()

  rotatedShape = shape.rotate(degrees, resample=Image.BICUBIC, expand=True)
  image.paste(rotatedShape, (x, y), rotatedShape)
  image.save(path.join(imageDirectory, 'output', str(degrees) + '_' + str(x) + '_' + str(y) + '_' + imageName))

  if (degrees < 360):
    return __rotateRepeat(x, y, copy, imageName, shape, degrees + 60)
  else:
    return

# settings = { image, shape, shapeDimensions }
def __repeatShape(x, y, image, imageName, shape):
  limitX = x + shape.width
  limitY = y + shape.height

  if (limitX < image.width and limitY < image.height):
    __rotateRepeat(x, y, image, imageName, shape, 0)

    print(limitX, limitY, image.width, image.height)

    if (limitX < image.width):
      return __repeatShape(x + 1, y, image, imageName, shape)
    elif (not limitX < image.width):
      return __repeatShape(0, y + 1, image, imageName, shape)
  else:
    return

path = os.path
__cwd = os.getcwd()
imageDirectory = os.path.join(__cwd, 'dataset', 'images', 'tfr')

shape = Image.open(path.join(__cwd, 'shapes', 'cross.png')).resize((100, 100)).filter(ImageFilter.GaussianBlur(1.2)) # Image with shape

coloredShape = __convertShapeColor(shape, (255, 0, 0))

# Load font and draw letter on shape
draw = ImageDraw.Draw(coloredShape)
fontSize = 24
font = ImageFont.truetype('ARIALNB.TTF', size=fontSize)
draw.text(((coloredShape.width / 2) - (fontSize / 4), (coloredShape.height / 2) - (fontSize / 2)), 'A', font=font, fill=(255, 255, 0, 255))

# Loop through the directory containing scenic images
for filename in os.listdir(imageDirectory):
  image = Image.open(path.join(imageDirectory, filename)) # Image with scene

  __repeatShape(0, 0, image, filename, coloredShape)
