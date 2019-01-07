import argparse
import numpy as np
import tensorflow as tf
from PIL import Image
from object_detection.utils import dataset_util

# Get command line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--height', help="Height of image", type=int)
parser.add_argument('--width', help="Width of image", type=int)
parser.add_argument('--filename', help="Filename of image", type=str)
parser.add_argument('--image_path', help="Path of image", type=str)
parser.add_argument('--xmins', help="xmins of image", type=int, nargs='+')
parser.add_argument('--xmaxs', help="xmaxs of image", type=int, nargs='+')
parser.add_argument('--ymins', help="ymins of image", type=int, nargs='+')
parser.add_argument('--ymaxs', help="ymaxs of image", type=int, nargs='+')
parser.add_argument('--classes_text', help="classes_text of image", type=str, nargs='+')
parser.add_argument('--classes', help="classes of image", type=int, nargs='+')
# Parse the arguments
args = parser.parse_args()

class_dict = {
  1: b'circle',
  2: b'semicircle',
  3: b'quarter_circle',
  4: b'triangle',
  5: b'square',
  6: b'rectangle',
  7: b'trapezoid',
  8: b'pentagon',
  9: b'hexagon',
  10: b'heptagon',
  11: b'octagon',
  12: b'star',
  13: b'cross'
}

# Write tfrecord
writer = tf.io.TFRecordWriter('C:/Websites/uhdt/tfrecords/data.tfrecord')

height = args.height # Image height
width = args.width # Image width
image_path = args.image_path
filename = str.encode(args.filename) # Filename of the image. Empty if image is not from file
with tf.gfile.GFile(filename, 'rb') as fid: # Encoded image bytes
  encoded_image_data = bytes(fid.read())
image_format = b'jpg' # b'jpeg' or b'png'

xmins = args.xmins # List of normalized left x coordinates in bounding box (1 per box)
xmaxs = args.xmaxs # List of normalized right x coordinates in bounding box
          # (1 per box)
ymins = args.ymins # List of normalized top y coordinates in bounding box (1 per box)
ymaxs = args.ymaxs # List of normalized bottom y coordinates in bounding box
          # (1 per box)

classes_text = []

for text in args.classes_text:
  t = str.encode(text)
  classes_text.append(t)

# classes_text = bytearray(args.classes_text) # List of string class name of bounding box (1 per box)
classes = args.classes # List of integer class id of bounding box (1 per box)
# TODO END
tf_label_and_data = tf.train.Example(features=tf.train.Features(feature={
    'image/height': dataset_util.int64_feature(height),
    'image/width': dataset_util.int64_feature(width),
    'image/filename': dataset_util.bytes_feature(filename),
    'image/source_id': dataset_util.bytes_feature(filename),
    'image/encoded': dataset_util.bytes_feature(encoded_image_data),
    'image/format': dataset_util.bytes_feature(image_format),
    'image/object/bbox/xmin': dataset_util.float_list_feature(xmins),
    'image/object/bbox/xmax': dataset_util.float_list_feature(xmaxs),
    'image/object/bbox/ymin': dataset_util.float_list_feature(ymins),
    'image/object/bbox/ymax': dataset_util.float_list_feature(ymaxs),
    'image/object/class/text': dataset_util.bytes_list_feature(classes_text),
    'image/object/class/label': dataset_util.int64_list_feature(classes),
}))

# Write to file
writer.write(tf_label_and_data.SerializeToString())

writer.close()
