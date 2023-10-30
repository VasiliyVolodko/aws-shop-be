import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const STOCKS_TABLE_NAME = 'Stocks'

export const getStocks = async () => {
  const response = await ddbDocClient.send(new ScanCommand({
    TableName: STOCKS_TABLE_NAME
  }))

  return response.Items
};

export const getStockById = async (productId: string) => {
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: STOCKS_TABLE_NAME,
      Key: {
        productId
      },
      AttributesToGet: ['count']
    })
  )

  return response.Item
};

export const createStock = async (productId) => {
  const response = await ddbDocClient.send(
    new PutCommand({
      TableName: STOCKS_TABLE_NAME,
      Item: {
        productId,
        count: 0
      }
    })
  )

  return response
}
