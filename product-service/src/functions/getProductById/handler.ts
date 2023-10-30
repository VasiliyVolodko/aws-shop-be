import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { getProductById, getStockById } from '@api';
import inputOutputLogger from '@middy/input-output-logger'

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters
  try {
    const product = await getProductById(id)
    const { count } = await getStockById(id)

    if (product && count) {
      return formatJSONResponse({
        ...product,
        count
      });
    }
    else {
      return errorRespone({ message: "Product not found" })
    }
  } catch (e) {
    return errorRespone(e, 500)
  }
  
};

export const main = middy(handler).use(inputOutputLogger()).use(cors())
