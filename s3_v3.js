import { PutObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import 'dotenv/config';

(async () => {
    const s3Client = new S3Client({
        logger: console,
        region: process.env.REGION,
        endpoint: process.env.ENDPOINT,
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    });

    // List
    const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        MaxKeys: 1,
    });

    try {
        let isTruncated = true;
        console.log("Your bucket contains the following objects:\n")

        let contents = "";
        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(listCommand);
            const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
            contents += contentsList + "\n";
            isTruncated = IsTruncated;
            listCommand.input.ContinuationToken = NextContinuationToken;
        }
        console.log(contents);

    } catch (err) {
        console.error(err);
    }

    // Put
    const putCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Body: "Hello S3!",
        Key: "hello.txt"
    });

    try {
        const response = await s3Client.send(putCommand);
        console.log(response);
    } catch (err) {
        console.error(err);
    }

    // Get
    const getCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: "hello.txt"
    });

    try {
        const response = await s3Client.send(getCommand);
        const str = await response.Body.transformToString();
        console.log(str);
    } catch (err) {
        console.error(err);
    }
})();
