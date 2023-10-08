import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyHandler } from 'aws-lambda';
import cors from '@middy/http-cors'
import middy from '@middy/core';
import products from '@mocks/mock.json'

const handler: APIGatewayProxyHandler = async () => {
  return formatJSONResponse({
    products
  });
};

export const main = middy(handler).use(cors())
