export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const errorRespone = (error: {message: string}) => {
  return {
    statusCode: 404,
    body: JSON.stringify(error)
  }
}
