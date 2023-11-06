export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
    },
    body: JSON.stringify(response)
  }
}

export const errorRespone = (error: { message: string }, statusCode = 404) => {
  return {
    statusCode,
    body: JSON.stringify(error)
  }
}
