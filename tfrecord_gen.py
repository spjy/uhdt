import argparse
import tensorflow as tf
from object_detection.utils import dataset_util

parser = argparse.ArgumentParser()
parser.add_argument('--height', help="Height of image")
parser.add_argument('--width', help="Width of image")
parser.add_argument('--filename', help="Filename of image")
parser.add_argument('--encoded_image_data', help="Encoded image data of image")
parser.add_argument('--image_format', help="Image format of image")
parser.add_argument('--xmins', help="xmins of image")
parser.add_argument('--xmaxs', help="xmaxs of image")
parser.add_argument('--ymins', help="ymins of image")
parser.add_argument('--ymaxs', help="ymaxs of image")
parser.add_argument('--classes_text', help="classes_text of image")
parser.add_argument('--classes', help="classes of image")

def create_tf_example(label_and_data_info):
  # TODO START: Populate the following variables from your example.
  height = None # Image height
  width = None # Image width
  filename = None # Filename of the image. Empty if image is not from file
  encoded_image_data = None # Encoded image bytes
  image_format = None # b'jpeg' or b'png'

  xmins = [] # List of normalized left x coordinates in bounding box (1 per box)
  xmaxs = [] # List of normalized right x coordinates in bounding box
            # (1 per box)
  ymins = [] # List of normalized top y coordinates in bounding box (1 per box)
  ymaxs = [] # List of normalized bottom y coordinates in bounding box
            # (1 per box)
  classes_text = [] # List of string class name of bounding box (1 per box)
  classes = [] # List of integer class id of bounding box (1 per box)
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
  
  return tf_label_and_data