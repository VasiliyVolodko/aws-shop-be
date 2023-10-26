import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { createProduct, createStock } from '@api';
import Joi from 'joi';

const productSchema = Joi.object({
  description: Joi.string(),
  price: Joi.number(),
  title: Joi.string()
}).exist()

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event
  const newProduct = JSON.parse(body)
  const validation = productSchema.validate(newProduct)
  if (validation.error) {
    return errorRespone(validation.error, 400)
  }
  try {
    const productId = await createProduct(newProduct)
    await createStock(productId)

    return formatJSONResponse({
      ...newProduct,
      id: productId
    });
  } catch(e) {
    return errorRespone(e)
  }
};

export const main = middy(handler).use(cors())
