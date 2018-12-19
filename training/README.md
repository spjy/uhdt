# Object Detection Training

After you have a hefty data set built, the next step is to train the model via the Tensorflow Object Detection API. The object detection model essentially learns the general characteristics of each shape within the bounding box we defined. While training, it is smart enough to create "checkpoints" while training, so you do not have to re-train already trained data. All you need to is re-run the `train.py` script and add additional data as needed.

## Requirements
1. Python 3.4 - 3.6
2. TensorFlow
3. TensorFlow Object Detection API
4. Git

## Installation

The installation instructions will start from the Python installation. In addition, this will assume you use a computer with the Windows 7+ operating system.

1. Install Python 3.4 - 3.6

  >**a.** Go to https://www.python.org/downloads/ and choose a version between the specified range above.
  >
  >When running the executable, be sure to add Python to your PATH (seen on the first page).

2. Install TensorFlow

  >**a.** For using only your CPU, run
  >```pip install tensorflow```
  >
  >**b.** Go to https://visualstudio.microsoft.com/vs/older-downloads/
  >
  >**c.** Select Redistributables and Build Tools,
  >
  >**d.** Download and install the Microsoft Visual C++ 2015 Redistributable Update 3.
  >
  >**e.** Install virtualenv ```pip install -U pip virtualenv```
  >
  >**f.** Verify the install by running this command in your command line: ```python -c "import tensorflow as tf; tf.enable_eager_execution(); print(tf.reduce_sum(tf.random_normal([1000, 1000])))"```

If you are finding that Python or PIP are not recognized
```
'python' is not recognized as an internal or external command,
operable program or batch file.
```
that means you did not add Python to your PATH. Simply go back to step #1 and follow the direction carefully.

3. Install the TensorFlow Object Detection API

  >**a.** Install Python package dependencies ```pip install Cython contextlib2 pillow lxml jupyter matplotlib```
  >
  >**b.** Download **protoc-3.6.1-win32.zip** here: https://github.com/protocolbuffers/protobuf/releases - this is to compile the .proto files into Python scripts
  >
  >**c.** Extract **protoc-3.6.1-win32.zip** into Program Files
  >
  >**d.** If you don't have it already, get git: https://git-scm.com/download/win
  >
  >**e.** Clone the TensorFlow models repository: ```git clone https://github.com/tensorflow/models.git```
  >
  >**f.** Change directory into /models/research: ```cd models/research```
  >
  >**g.** Open a terminal in the directory you just changed to and run: ```“C:\Program Files\protoc-3.6.1-win32\bin\protoc.exe” --python_out=. object_detection/protos/*.proto```
  >
  >**h.** Add the /slim directory of Python scripts to your PYTHONPATH: ```set PYTHONPATH=$PYTHONPATH:`cd`:`cd`/slim```
  >
  >**i.** Test your installation ```python object_detection/builders/model_builder_test.py```

## Installation Difficulties

While installing everything manually, I ran into various issues:

1. When compiling .proto files, make sure to add the `--python_out=.` flag directly after `protoc.exe`. It must be a parsing error of the arguments on Protobuf's
2. Be sure to run the object detection setup using `py setup.py` install in `models/research`. This step isn't mentioned in the official installation.
3. Make sure to add `/models/research/slim` to the PYTHONPATH.
4. Only have one Python installation at a time or make sure the Python installation you are using is the one specified in your PATH.
5. Only have either the TF CPU or TF-GPU installed at a time. They will conflict with each other.

## Training the Object Detection Model
Before training the model, be sure you have the following:

1. A model config file
2. The checkpoint (.ckpt) file from the model
3. A label map of possible classes
4. TFRecord files to train on
5. `train.py` from `models/research/object_detection/legacy/`
6. `export_inference_graph.py` from `models/research/object_detection/`

Organize and copy the above files into a folder with the file structure:

```
/model.ckpt
/train.py
/export_inference_graph.py
/faster_rcnn_resnet101_coco.config
/models/train/tfrecord_files.record-?????-of-!!!!!
```

Then:

1. To train the data set, run the command:

```bash
python train.py --logtostderr --train_dir=./models/train --pipeline_config_path=faster_rcnn_resnet101_coco.config
```

Training will take a good while depending on how much data you have. Monitor the 'loss' value while it is training. If it is a relatively low value and does not fluctuate significantly.

2. After training, you should be left with a `model.ckpt-????` file where `????` is the range of training points. From this, you will need to convert it into a frozen inference graph. To do this, run

```bash
python export_inference_graph.py --input_type image_tensor --pipeline_config_path ./faster_rcnn_resnet101_coco.config --trained_checkpoint_prefix ./models/train/model.ckpt-???? --output_directory ./fine_tuned_model
```

This should output a `frozen_inference_graph.pb` file, a file which stores the model and allows you to detect objects.

### Model Config File

For possible model config files, see:
https://github.com/tensorflow/models/tree/master/research/object_detection/samples/configs

For the competition, we will be using the Faster RCNN ResNet101 COCO model. Faster RCNN is an algorithm that consists of a convolutional neural network based on rectangular region proposals. Essentially, it analyzes the image and proposes various regions that could be the object and evalutes them until it converges onto the correct object. ResNet101 is the name of the research paper. COCO is the data set that the model is based off of.

The objects that we are concerned with are:

1. `model.faster_rcnn.num_classes`

This is an integer value of however many classes that we have in the label map.

2. `train_input_reader.tf_record_input_reader.input_path`

This is the path of the training tfrecord files. The tfrecord files should be in the format of `tfrecord.record-?????-of-!!!!!` where `?????` is the minimum value of tfrecords and `!!!!!` is the maximum value of tfrecords you are training.

3. `train_input_reader.label_map_path`

This is the path to the label map (a .pbtxt file).

4. `eval_config.num_examples`

An integer number of examples.

5. `train_config.fine_tune_checkpoint`

The path to the model's checkpoint file (a .ckpt file).

6. `eval_input_reader.tf_record_input_reader.input_path`

This is the path of the evaluating tfrecord files. The tfrecord files should be in the format of `tfrecord.record-?????-of-!!!!!` where `?????` is the minimum value of tfrecords and `!!!!!` is the maximum value of tfrecords you are training.

7. `eval_input_reader.label_map_path`

This is the path to the label map (a .pbtxt file).

### Model Checkpoints
For a list of possible models, see: https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md#coco-trained-models

A model's checkpoint is essentially where the model left off with training. TensorFlow provides this file so we can apply transfer learning to the said model, a technique where we use a pre-existing model to train on in order to reduce training times.

### Label Map

A label map is a list of classes in the model. Each item has an object 'id' which is the integer value of the class and an object 'name', a human readable string of the class. For example:

```
item {
  id: 1,
  name: 'circle'
}
item {
  id: 2,
  name: 'semicircle'
}
```

### TFRecords
These are generated from the UHDT Data Set Creator.

