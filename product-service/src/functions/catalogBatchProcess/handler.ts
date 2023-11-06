import { SQSEvent } from 'aws-lambda';
import middy from '@middy/core';
import { createProduct } from '@api';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const SNS_ARN = process.env.SNS_ARN

const handler = async (event: SQSEvent) => {
  const clientSNS = new SNSClient()
  for (let record of event.Records) {
    const { title, description, price, count } = JSON.parse(record.body)
    console.log(record.body)
    if (!title || !description || !price) {
      return
    }
    try {
      await createProduct({ title, description, price: +price, count: +count })
      await clientSNS.send(new PublishCommand({
        Message: JSON.stringify({ title, description, price: +price, count: +count }),
        Subject: 'Product created',
        TargetArn: SNS_ARN
      }))
    } catch (e) {
      console.log('smt went wrong', e)
    }
  }
};

export const main = middy(handler)
