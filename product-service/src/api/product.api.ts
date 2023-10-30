import { DynamoDBClient, TransactWriteItem } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { STOCKS_TABLE_NAME } from "./stocks.api";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const PRODUCT_TABLE_NAME = 'Products'

export const getProducts = async () => {
  const response = await ddbDocClient.send(new ScanCommand({
    TableName: PRODUCT_TABLE_NAME
  }))

  return response.Items
};

export const getProductById = async (id: string) => {
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: PRODUCT_TABLE_NAME,
      Key: {
        id
      }
    })
  )

  return response.Item
};

export const createProduct = async (product) => {
  const id = uuidv4()
  await ddbDocClient.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: PRODUCT_TABLE_NAME,
            Item: {
              ...product,
              id
            }
          }
        },
        {
          Put: {
            TableName: STOCKS_TABLE_NAME,
            Item: {
              productId: id,
              count: 0
            }
          }
        }
      ]
    })
  )

  return id
}
