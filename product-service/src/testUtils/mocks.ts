import { APIGatewayProxyEvent } from "aws-lambda"

export const buildMockEvent = ({ path = '', pathParameters = null, body = '', queryStringParameters = null } = {}): APIGatewayProxyEvent => {
  return {
    resource: "/",
    path,
    httpMethod: "POST",
    headers: null,
    multiValueHeaders: null,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    pathParameters,
    stageVariables: null,
    requestContext: null,
    body,
    isBase64Encoded: false
  }
}