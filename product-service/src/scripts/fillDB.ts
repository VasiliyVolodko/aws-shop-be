import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import products from '@mocks/product.json'
import stocks from '@mocks/stock.json'
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const clearTables = async () => {
  const products = await ddbDocClient.send(new ScanCommand({
    TableName: 'Products',
    AttributesToGet: ['id']
  }))
  const stocks = await ddbDocClient.send(new ScanCommand({
    TableName: 'Stocks',
    AttributesToGet: ['productId']
  }))

  const command = new BatchWriteCommand({
    RequestItems: {
      Products: products.Items.map(product => ({
        DeleteRequest: {
          Key: { id: product.id }
        }
      })),
      Stocks: stocks.Items.map(stock => ({
        DeleteRequest: {
          Key: { productId: stock.productId }
        }
      }))
    }
  })

  await ddbDocClient.send(command);
};

export const fillTables = async () => {
  const command = new BatchWriteCommand({
    RequestItems: {
      Products: products.map(product => ({
        PutRequest: {
          Item: product
        }
      })),
      Stocks: stocks.map(stock => ({
        PutRequest: {
          Item: stock
        }
      })),
    }
  });

  await ddbDocClient.send(command);
};

const fillDB = async () => {
  await clearTables();
  await fillTables();
}

fillDB()

ddbDocClient.destroy()
client.destroy();
