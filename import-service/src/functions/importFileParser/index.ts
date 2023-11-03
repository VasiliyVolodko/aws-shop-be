import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        event: 's3:ObjectCreated:*',
        bucket: '${self:provider.environment.S3_BUCKET_NAME}',
        rules: [
          {
            prefix: 'upload/'
          },
          {
            suffix: '.csv'
          }
        ],
        existing: true
      }
    },
  ],
};
