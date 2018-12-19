# uhdt dataset creator

The UHDT Dataset Creator is a JavaScript application built using the JavaScript Image Manipulation Program. It allows us to semi-autonomously incorporate various shapes including randomized sizes, colors, shapes, shape/letter orientation, and letters that we could possibly see in the compeitition rather than manually appending shapes and randomizing attributes in a photo editing program. As a result, not only less time will be needed to generate the dataset, but we will also increase the size of the dataset significantly.

In a nutshell, functionally, the program loops through all images within a directory and loads the said images into memory. Simultaneously, it loads in a random shape and also chooses a random blurriness amount, color, shape, orientation and size using a random number generator. From there, it will composite the previously selected random attributes onto image loaded into memory. It will loop until all images have been covered within the directory. After it is finished with compositing the image, a command will be sent in order to run the TensorFlow Record (tfrecord) generator. It requires the height, width, filename, image data, image format, bounding box minima and maxima and classes, all of which will be passed in via arguments. It will output the into a .tfrecord file which is required for training the object detection model. This whole process takes five seconds on average per image; a manual process would take 15x longer.

The program generates shapes that are sufficiently accurate enough for the object detection model to learn; it only needs to learn the basic characteristics of each shape with similar backgrounds to the competition. We are exploiting the way that a neural network works through data augmentation. For example, given a shape with the same characteristics, if it is rotated even by only one degree, it sees that as a completely different shape. Thus, we can vary the same shape in different ways and as a result it will have a positive affect the neural network's learning.

## Requirements
1. Node.js
2. npm

## Set up
1. Clone this repository `https://github.com/spjy/uhdt.git`
2. Install dependencies `npm i`
3. Place images in `./dataset/images/test`
4. Run script `npm start`
5. Pictures will output to `./dataset/images/test/output/{imageName}_with_target.jpg`

## Directory Structure

`dataset_creation.js` - This is the script that appends a random shape to each image.

`tfrecord_gen.py` - This script automatically generates the .tfrecord file.

`/shapes` - This directory contains the shape files to append to each image.

`/dataset` - This directory contains the images that you would like to append the shapes to. To change the working directory, edit line 5 within `dataset_creation.js`.

`/dataset/output` - This is where you will find the outputted images/.tfrecord files.
