import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyHandler } from 'aws-lambda';
import cors from '@middy/http-cors'
import middy from '@middy/core';
import { getProducts, getStocks } from '@api';

const handler: APIGatewayProxyHandler = async () => {

  const products = await getProducts()
  const stock = await getStocks()

  const response = products.map(product => {
    const count = stock.find(stock => stock.productId === product.id)
    return {
      ...product,
      count
    }
  })

  return formatJSONResponse({
    response
  });
};

export const main = middy(handler).use(cors())
