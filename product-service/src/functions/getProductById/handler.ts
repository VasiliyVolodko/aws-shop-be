import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { getProductById, getStockById } from '@api';

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters

  const product = await getProductById(id)
  const stock = await getStockById(id)

  if (product && stock) {
    return formatJSONResponse({
      ...product,
      ...stock
    });
  }
  else {
    return errorRespone({ message: "Product not found"})
  }
};

export const main = middy(handler).use(cors())
