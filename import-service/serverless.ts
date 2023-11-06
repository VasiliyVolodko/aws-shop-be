import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    region: 'eu-west-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:provider.region}',
      S3_BUCKET_NAME: 'my-uploaded-files-learning',
      UPLOAD_FOLDER: 'upload',
      PARSED_FOLDER: 'parsed',
      SQS_URL: '${cf:product-service-dev.sqsUrl}'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::my-uploaded-files-learning/*'
          },
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: "arn:aws:sqs:eu-west-1:760088124454:catalogItemsQueue"
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
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
  },
};

module.exports = serverlessConfiguration;
