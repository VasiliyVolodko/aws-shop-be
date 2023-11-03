import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors'
import inputOutputLogger from '@middy/input-output-logger'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION
const BUCKET = process.env.S3_BUCKET_NAME
const KEY = process.env.UPLOAD_FOLDER


const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { name } = event.queryStringParameters

  if (!name) {
    return errorRespone({ message: 'Name query not found' }, 400)
  }
  try {
    const client = new S3Client({ region: REGION });
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: `${KEY}/${name}`, ContentType: 'text/csv' });
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
  
    return formatJSONResponse({
      signedUrl
    });
  } catch (e) {
    return errorRespone(e, 500)
  }
};

export const main = middy(handler).use(inputOutputLogger()).use(cors());
