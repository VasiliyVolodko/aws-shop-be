import { APIGatewayAuthorizerEvent } from 'aws-lambda';
import middy from '@middy/core';
import { configDotenv } from 'dotenv'

configDotenv()

const handler = async (event: APIGatewayAuthorizerEvent) => {
  console.log(event.type)
  if (event.type !== 'TOKEN') {
    return 'Unauthorized'
  }

  try {
    const token = event.authorizationToken

    const encodedCreds = token.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const [username, password] = buff.toString('utf-8').split(':')

    console.log(`username: ${username}; password: ${password}`)
    const effect = process.env[username] && process.env[username] === password ? 'Allow' : 'Deny'
    return generatePolicy(encodedCreds, effect, event.methodArn)

  } catch (e) {
    return 'Unauthorized'
  }
};

const generatePolicy = (principalId: string, Effect: string, Resource: string) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource
      }
    ]
  }
})

export const main = middy(handler)
