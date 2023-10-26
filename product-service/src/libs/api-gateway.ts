export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const errorRespone = (error: { message: string }, statusCode = 404) => {
  return {
    statusCode,
    body: JSON.stringify(error)
  }
}
