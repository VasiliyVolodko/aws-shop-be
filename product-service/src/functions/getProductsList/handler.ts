import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyHandler } from 'aws-lambda';
import cors from '@middy/http-cors'
import middy from '@middy/core';
import { getProducts, getStocks } from '@api';
import inputOutputLogger from '@middy/input-output-logger'
import { errorRespone } from '../../libs/api-gateway';

const handler: APIGatewayProxyHandler = async () => {
  try {
    const products = await getProducts()
    const stock = await getStocks()

    const response = products.map(product => {
      const count = stock.find(stock => stock.productId === product.id)
      return {
        ...product,
        count: count.count
      }
    })

    return formatJSONResponse({
      products: response
    });
  } catch (e) {
    return errorRespone(e, 500)
  }
};

export const main = middy(handler).use(inputOutputLogger()).use(cors())
