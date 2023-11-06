import { main as getProductById } from '../functions/getProductById/handler'
import { buildMockEvent } from '../testUtils/mocks'
import products from '@mocks/product.json'

jest.mock('@middy/core', () => {
  return (handler) => {
    return {
      use: jest.fn().mockImplementation(() => {
        // ...use(ssm()) will return handler function
        return {
          before: jest.fn().mockReturnValue(handler)
        }
      })
    }
  }
})

describe('getProductById', () => {
  it('should return product with correct id', async () => {
    const response = await getProductById(buildMockEvent({pathParameters: {id: products[2].id}}), undefined)
    const result = JSON.parse(response.body)
    expect(result.product).toStrictEqual(products[2])
  })

  it('should return error if id not found', async () => {
    const response = await getProductById(buildMockEvent({ pathParameters: { id: 'some id' } }), undefined)
    const expectedResult = {
      statusCode: 404,
      body: JSON.stringify({
        message: "Product not found"
      })
    }
    expect(response).toStrictEqual(expectedResult)
  })
})