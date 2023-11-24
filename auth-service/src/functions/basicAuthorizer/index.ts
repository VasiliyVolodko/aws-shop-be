import { handlerPath } from '@libs/handler-resolver';
// import { AWS } from '@serverless/typescript';

// const functions: AWS['functions'] = {
//   catalogBatchProcess: {
//     handler: `${handlerPath(__dirname)}/handler.main`
//   }
// }

// export const { basicAuthorizer } = functions

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
};
