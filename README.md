# uhdt dataset creator

The UHDT Dataset Creator is a JavaScript application built using the JavaScript Image Manipulation Program. It allows us to semi-autonomously incorporate various shapes including randomized sizes, colors, shapes, shape/letter orientation, and letters that we could possibly see in the compeitition rather than manually appending shapes and randomizing attributes in a photo editing program. As a result, not only less time will be needed to generate the dataset, but we will also increase the size of the dataset significantly.

In a nutshell, functionally, the program loops through all images within a directory and loads the said images into memory. Simultaneously, it loads in a random shape and also chooses a random blurriness amount, color, shape, orientation and size using a random number generator. From there, it will composite the previously selected random attributes onto image loaded into memory. It will loop until all images have been covered within the directory. After it is finished with compositing the image, a command will be sent in order to run the TensorFlow Record (tfrecord) generator. It requires the height, width, filename, image data, image format, bounding box minima and maxima and classes, all of which will be passed in via arguments. It will output the into a .tfrecord file which is required for training the object detection model.

The program generates shapes that are sufficiently accurate enough for the object detection model to learn; it only needs to learn the basic characteristics of each shape with similar backgrounds to the competition.

## Requirements
1. Node.js
2. npm

## Set up
1. Clone this repository `https://github.com/spjy/uhdt.git`
2. Install dependencies `npm i`
3. Place images in `./dataset/images/test`
4. Run script `npm start`
5. Pictures will output to `./dataset/images/test/output/{imageName}_with_target.jpg`
