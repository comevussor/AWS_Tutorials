# Set up a cloud based basic online face recognition app with Amazon Rekognition

The app will be able to register a set of faces and say if a candidate face is in the set or not.

## Architecture

We need :
- a web server (Apache) on an Amazon EC2 instance
- an app server (Node.js) on an Amazon EC2 instance
- an Amazon S3 bucket
- an access to Amazon Rekognition services
- a private PC terminal with webcam

The web server will display a web page with :
- the webcam image
- a button to take a snapshot an register a new face
- a button to take a snapshot and try to recognize it
- a display zone for the snapshots (for control)

The app server will :
- collect pictures to register and store them in the S3 bucket
- collect pictures to compare and activate Rekognition to know if the face is stored already

