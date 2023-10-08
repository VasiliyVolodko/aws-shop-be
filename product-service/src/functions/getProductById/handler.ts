import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import products from '@mocks/mock.json'
import middy from '@middy/core';
import cors from '@middy/http-cors'

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters

  const product = products.find(product => product.id === id)

  if (product) {
    return formatJSONResponse({
      product
    });
  }
  else {
    return errorRespone({ message: "Product not found"})
  }
};

export const main = middy(handler).use(cors())
