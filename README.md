# UHDT Data Set Creator

The UHDT Data Set Creator is a JavaScript application built using the JavaScript Image Manipulation Program. It allows us to semi-autonomously incorporate various shapes including randomized sizes, colors, shapes, shape/letter orientation, location, and letters that we could possibly see in the competition rather than manually appending shapes and randomizing attributes in a photo editing program. As a result, not only less time will be needed to generate the dataset, but we will also increase the size of the data set significantly. Creating a gargantuan amount of data, on the order of 10^4 datapoints, is essential for accurate results. 

In a nutshell, functionally, the program loops through all images within a directory and loads the said images into memory. Simultaneously, it loads in a random shape and letter and also chooses a random blurriness amount, color, shape, orientation, location and size using a random number generator. From there, it will composite the previously selected random attributes onto image loaded into memory. It will loop until all images have been covered within the directory. After it is finished with compositing the image, a command will be sent in order to run the TensorFlow Record (tfrecord) generator. It requires the height, width, filename, image data, image format, bounding box minima and maxima and classes, all of which will be passed in via arguments. It will output the into a .tfrecord file which is required for training the object detection model. This whole process takes five seconds on average per image; to the contrary a manual process would take approximately 15x longer than this method.

The program generates shapes that are sufficiently accurate enough for the object detection model to learn; it only needs to learn the basic characteristics of each shape with similar backgrounds to the competition. We are exploiting the way that a neural network works through data augmentation. For example, given a shape with the same characteristics, if it is rotated even by only one degree, it sees that as a completely different shape. Thus, we can vary the same shape in different ways and as a result it will have a positive affect the neural network's learning.

## Requirements
1. Node.js (latest LTS version)
2. Git

## Set up
1. Install Node.js - go to https://nodejs.org/en/download/ and install based on your operating system.
2. Install Git - go to https://git-scm.com/book/en/v2/Getting-Started-Installing-Git and install based on your operating system.
2. Clone this repository `git clone https://github.com/spjy/uhdt.git`
3. Change directories into the repository folder `cd uhdt`
4. To install dependencies, run the command `npm i`
5. Place images in the folder `./dataset`
6. To run the script, `npm start`
7. Pictures/.tfrecords will output to `./dataset/images/test/output/{imageName}_with_target.jpg`

## Directory Structure

The following is a description of various files and directories relative to the root directory.

`dataset_creation.js` - This is the script that appends a random shape to each image.

`tfrecord_gen.py` - This script automatically generates the .tfrecord file.

`/shapes` - This directory contains the shape files to append to each image.

`/dataset` - This directory contains the images that you would like to append the shapes to. To change the working directory, edit line 5 within `dataset_creation.js`.

`/dataset/output` - This is where you will find the outputted images/.tfrecord files.

## Randomized Data Options

As mentioned in the brief, this program has the ability to select a random shape and letter and also choose a random blurriness amount, color, shape, orientation, location and size. Here are the options in more detail:

### Blurriness Amount
Since blurry pictures are a possibility due to, for example, having a low shutter speed but high aircraft speed. A Gaussian blur is applied and has a range of values of `1-7`.

### Color
The following are the possible colors that the program can randomize, and these colors are specified by AUVSI SUAS.

1. Red
2. Green
3. Blue
4. Black
5. White
6. Grey
7. Yellow
8. Purple
9. Brown
10. Orange

### Shape (Class)
The following are the possible shapes (or in terms of TensorFlow, classes) that the program can randomize, and these shapes are specified by AUVSI SUAS. All the shapes, by default, are black in order to easily manipulate the colors specified above.

1. Cross
2. Ellipse
3. Half Circle
4. Heptagon
5. Octagon
6. Pentagon
7. Quarter Circle
8. Rectangle
9. Square
10. Star
11. Trapezoid
12. Triangle

### Orientation
The possible degrees of orientation that a shape can be is between zero to three hundred and sixty degrees (0-360 degrees).

### Size
The range of sizes that the shape can be is between fifty to seventy pixels (50-70 pixels).

### Location
The shape can be placed anywhere randomly within the image minus the dimensions of the shape plus ten pixels (the addition of ten pixels is merely a buffer).

## TensorFlow Record (TFRecord) Generation

After the compositing of the shape onto the image, a TFRecord file is generated within the `tfrecord_gen.py`. The following arguments are required in order to generate the file:

1. `height`

**Data Type**: int

**Description**: The height of the image.

2. `width`

**Data Type**: int

**Description**: The width of the whole image.

3. `filename`

**Data Type**: string

**Description**: The name of the image file.

4. `encoded_image_data`

**Data Type**: base64

**Description**: The image but encoded into base64 format.

5. `format`

**Data Type**: enum `['jpeg', 'png']`

**Description**: The extension of the image, can be either jpeg or png.

6. `xmin`

**Data Type**: list

**Description**: A list of normalized left x coordinates in bounding box (1 per box)

7. `xmax`

**Data Type**: list

**Description**: A list of normalized right x coordinates in bounding box (1 per box)

8. `ymin`

**Data Type**: list

**Description**: A list of normalized top y coordinates in bounding box (1 per box)

9. `ymax`

**Data Type**: list

**Description**: A list of normalized bottom y coordinates in bounding box(1 per box)

10. `text`

**Data Type**: list

**Description**: A list of strings of human readable class names.

11. `label`

**Data Type**: list

**Description**: A list of integer values of the classes.

An example command to run the `tfrecord_gen.py` script:

```bash
python tfrecord_gen.py
  --height 1920
  --width 1080
  --filename 'IMAGE_NAME'
  --encoded_image_data base64(IMAGE_NAME)
  --image_format 'jpeg'
  --xmins [20]
  --xmaxs [403]
  --ymins [1041]
  --ymaxs [203]
  --classes_text ['square']
  --classes [4]
```
