export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'this is the get integrations endpoint',
    }),
  }
}
