import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
  catalogBatchProcess: {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        sqs: {
          batchSize: 5,
          arn: {
            "Fn::GetAtt": ['catalogItemsQueue', 'Arn']
          }
        }
      }
    ]
  }
}

export const { catalogBatchProcess } = functions
