import { S3Event } from 'aws-lambda';
import middy from '@middy/core';
import { DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Stream } from 'stream';
const csvParser = require("csv-parser");

const PARSED_FOLDER = process.env.PARSED_FOLDER
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER

const handler = async (event: S3Event): Promise<void> => {
  const obj = event.Records[0]
  const result = []
  const client = new S3({ region: obj.awsRegion });
  const response = await client.getObject({
    Bucket: obj.s3.bucket.name,
    Key: obj.s3.object.key
  })

  response.Body
    .pipe(csvParser())
    .on("data", (record) => {
      result.push(record)
    })
    .on('end', async () => {
      const upload = new Upload({
        client,
        params: {
          Bucket: obj.s3.bucket.name,
          Key: obj.s3.object.key.replace('csv', 'json').replace(UPLOAD_FOLDER, PARSED_FOLDER),
          Body: Stream.Readable.from(JSON.stringify(result))
        }
      })
      await upload.done()

      try {
        await client.send(new DeleteObjectCommand({
          Bucket: obj.s3.bucket.name,
          Key: obj.s3.object.key
        }));
      } catch (err) {
        console.log("Error", err);
      }
    })
};

export const main = middy(handler)
