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

Open an SSH connection (I use PuTTY) and enter [the commands](Rekognition/Command%20Line%20Front%20End.txt)

```
sudo yum update -y
sudo yum -y install httpd
sudo service httpd start
sudo chkconfig --add httpd
```



