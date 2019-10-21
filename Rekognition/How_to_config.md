# Set up a cloud based basic online face recognition app with Amazon Rekognition (3-4 hours)

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

## Set up the web server

Launch an EC2 instance with :
- Amazon Linux 2 AMI
- t2.micro type
- located in a public subnet
- disable auto-assign public IP
- 8GiB SSD
- tag : Name : web server
- Security group name : web server

|Type|Protocol|Port Range|Source|Description|
|:-:|:-:|:-:|:-:|:-:|
|SSH|TCP|22|0.0.0.0/0|allow SSH connection|
|All ICMP - IPv4|ICMP|0-65535|0.0.0.0/0|allow ping|
|HTTP|TCP|80|0.0.0.0/0|allow http|

- don't forget to choose a key pair
- create and assign an elastic IP to the instance

Open an SSH connection (I use PuTTY).
Login as ec2-user (default user on this AMI).
Enter [the commands](Rekognition/Command%20Line%20Front%20End.txt)

```
sudo yum update -y
sudo yum -y install httpd
sudo service httpd start
```

Check that server is online on your browser with http://myPublicIP . You should see the default Apache test page.

### Configure the front end web page using [this html file](Rekognition/DSTIFamily.html) and [this .min.js file](Rekognition/webcam.min.js)

Let us say you want to import them from GitHub (easy way). Be careful, on Apache install, the current user has no rights on the default html directory... so you must use sudo commands. And remember that default page should be named index.html.

```
cd /var/www/html directory
sudo wget https://raw.githubusercontent.com/comevussor/AWS_Tutorials/master/Rekognition/webcam.min.js
sudo wget https://raw.githubusercontent.com/comevussor/AWS_Tutorials/master/Rekognition/DSTIFamily.html
sudo mv DSTIFamily.html index.html
```

Reload the Apache test page, it should be replaced by a WebcamJS Test Page. BUT recent navigators like Chrome and Firefox require https to activate the webcam. So you might not see the image. See [here](https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339) a simple way to solve the issue on Chrome. Or downgrade your version.

At this point the "Rekognise" and "Register" buttons should be working : each time you click on them, a snapshot should appear on the right hand side of the page.

## Set up the app server

Launch an EC2 instance with :
- Amazon Linux 2 AMI
- t2.micro type
- located in a public subnet
- disable auto-assign public IP
- 8GiB SSD
- tag : Name : app server
- Security group name : web server

|Type|Protocol|Port Range|Source|Description|
|:-:|:-:|:-:|:-:|:-:|
|SSH|TCP|22|0.0.0.0/0|allow SSH connection|
|All ICMP - IPv4|ICMP|0-65535|0.0.0.0/0|allow ping|
|Custom TCP Rule|TCP|8080|0.0.0.0/0|allow dialog with web server|

- don't forget to choose a key pair
- create and assign an elastic IP to the instance

Open an SSH connection (I use PuTTY).
Login as ec2-user (default user on this AMI).
Enter the commands :

```
sudo yum update -y
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum -y install nodejs
npm install
npm install aws-sdk
npm install body-parser
npm install data-uri-to-buffer
npm install express
```

Import the [server.js](Rekognition/server.js) file :
```
sudo wget https://raw.githubusercontent.com/comevussor/AWS_Tutorials/master/Rekognition/server.js
node server.js
```

At this point, the server should be alive. Keep your PuTTY connection open an go to http://myPublicIP:8080 .
You should read "LEOOO GET" on your PuTTY terminal.

