import AWS from 'aws-sdk';
import 'dotenv/config';

AWS.config.logger = console;

const s3 = new AWS.S3({
    logger: console,
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT,
    s3ForcePathStyle: true,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

var bucketParams = {
    Bucket: process.env.BUCKET
};

// List
const requestObject = s3.listObjects(bucketParams, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("listObjects: ", data);
    }
});

requestObject.on('build', function () {
    req.httpRequest.headers['Custom-Header'] = 'value';
});

requestObject.on('httpHeaders', (statusCode, headers, response, statusMessage) => {
    console.log("headers: ", headers);
    console.log("statusMessage: ", statusMessage);
});

requestObject.promise()
    .then(response => {
        console.log("response: ", response);
    });

// Put
var uploadParams = {
    Bucket: process.env.BUCKET,
    Key: "hello.txt",
    Body: "Hello S3!"
};

s3.upload(uploadParams, function (err, data) {
    if (err) {
        console.log(err);
    } if (data) {
        console.log("upload: ", data.Location);
    }
});

// Get
var params = {
    Bucket: process.env.BUCKET,
    Key: "hello.txt"
};

s3.getObject(params, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("getObject: ", data);
        console.log("Body: ", data.Body.toString('utf-8'));
    }
});
