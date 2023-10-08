import { main as getProductsList } from '../functions/getProductsList/handler'
import { buildMockEvent } from '../testUtils/mocks'
import products from '@mocks/mock.json'

jest.mock('@middy/core', () => {
  return (handler) => {
    return {
      use: jest.fn().mockReturnValue(handler), // ...use(ssm()) will return handler function
    }
  }
})

describe('getProductsList', () => {
  it('should return correct product list', async () => {
    const response = await getProductsList(buildMockEvent(), undefined)
    const result = JSON.parse(response.body)
    expect(result.products).toStrictEqual(products)
  })
})