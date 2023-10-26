import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Products'

export const getProducts = async () => {
  const response = await ddbDocClient.send(new ScanCommand({
    TableName: TABLE_NAME
  }))

  return response.Items
};

export const getProductById = async (id: string) => {
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id
      }
    })
  )

  return response.Item
};

export const createProduct = async (product) => {
  const id = uuidv4()
  console.log(product)
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...product,
        id
      }
    })
  )

  return id
}
