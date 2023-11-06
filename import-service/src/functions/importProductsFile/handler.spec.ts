import { buildMockEvent } from '../../testUtils/mocks'
import { main } from './handler'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(() => Promise.resolve('url'))
}))

describe('importProductFiles', () => {
  it('should retutn error with correct message', async () => {
    const event = buildMockEvent({ queryStringParameters: {o: 'asd'} })
    const response = await main(event, undefined)
    expect(JSON.parse(response.body).message).toBe('Name query not found')
    expect(response.statusCode).toBe(400)
  })

  it('should retutn error with correct message in case of aws issue', async () => {
    (getSignedUrl as jest.Mock).mockReturnValueOnce(Promise.reject('some error'))
    const event = buildMockEvent({ queryStringParameters: { name: 'file' } })
    const response = await main(event, undefined)
    expect(JSON.parse(response.body)).toBe('some error')
  })

  it('should retutn correct url', async () => {
    const event = buildMockEvent({ queryStringParameters: { name: 'file' } })
    const response = await main(event, undefined)
    expect(JSON.parse(response.body).signedUrl).toBe('url')
  })
})