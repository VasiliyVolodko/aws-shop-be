import { errorRespone, formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors'
import { createProduct } from '@api';
import Joi from 'joi';
import inputOutputLogger from '@middy/input-output-logger'

const productSchema = Joi.object({
  description: Joi.string().required(),
  price: Joi.number().required(),
  title: Joi.string().required()
})

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event
  const newProduct = JSON.parse(body)
  const validation = productSchema.validate(newProduct, { convert: false })
  console.log(validation.error)
  console.log(validation.value)
  console.log(validation.warning)

  if (validation.error) {
    return errorRespone(validation.error, 400)
  }
  try {
    const productId = await createProduct(newProduct)

    return formatJSONResponse({
      ...newProduct,
      id: productId
    });
  } catch(e) {
    return errorRespone(e, 500)
  }
};

export const main = middy(handler).use(inputOutputLogger()).use(cors())
