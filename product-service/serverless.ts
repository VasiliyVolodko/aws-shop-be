import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductById, createProduct, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: {
        Ref: 'catalogItemsQueue'
      },
      SNS_ARN: {
        Ref: 'createProductTopic'
      }
    },
    region: 'eu-west-1',
    stage: 'dev',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: 'arn:aws:dynamodb:${aws:region}:*:table/Products'
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: 'arn:aws:dynamodb:${aws:region}:*:table/Stocks'
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: {
              Ref: 'createProductTopic'
            }
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      ProductsDynamoDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      StocksDynamoDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'productId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'productId',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      EmailSubSNS: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'volodkovasya@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          }
        }
      }
    },
    Outputs: {
      sqsUrl: {
        Value: '${self:provider.environment.SQS_URL}',
        Export: {
          Name: 'sqsUrl'
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: 'n7n8t60kf0.execute-api.eu-west-1.amazonaws.com/${self:provider.stage}'
    }
  },
};

module.exports = serverlessConfiguration;
