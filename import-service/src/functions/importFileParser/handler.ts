import { S3Event } from 'aws-lambda';
import middy from '@middy/core';
import { DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { SQS } from '@aws-sdk/client-sqs'
import { Upload } from '@aws-sdk/lib-storage';
import { Stream } from 'stream';
const csvParser = require("csv-parser");

const PARSED_FOLDER = process.env.PARSED_FOLDER
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER
const SQS_URL = process.env.SQS_URL

const handler = async (event: S3Event): Promise<void> => {
  const obj = event.Records[0]
  const result = []
  const client = new S3({ region: obj.awsRegion });
  const sqsClient = new SQS({region: obj.awsRegion})
  const response = await client.getObject({
    Bucket: obj.s3.bucket.name,
    Key: obj.s3.object.key
  })
  try {
    await new Promise<void>((resolve) => {
      response.Body
        .pipe(csvParser())
        .on("data", async (record) => {
          result.push(record)
          try {
            await sqsClient
              .sendMessage({
                QueueUrl: SQS_URL,
                MessageBody: JSON.stringify(record),
              })
          } catch (e) {
            console.log('error while sending a message:', e)
          }
        })
        .on('end', async () => {
          resolve()
        })
    })

    await new Upload({
      client,
      params: {
        Bucket: obj.s3.bucket.name,
        Key: obj.s3.object.key.replace('csv', 'json').replace(UPLOAD_FOLDER, PARSED_FOLDER),
        Body: Stream.Readable.from(JSON.stringify(result))
      }
    }).done()

    await client.send(new DeleteObjectCommand({
      Bucket: obj.s3.bucket.name,
      Key: obj.s3.object.key
    }));
  } catch (err) {
    console.log("Error", err);
  }
  
};

export const main = middy(handler)
