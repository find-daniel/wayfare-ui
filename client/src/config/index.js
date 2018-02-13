const url = {
  restServer: process.env.NODE_ENV === 'PRODUCTION' ? process.env.DEV_REST_SERVER_URL : process.env.REST_SERVER_URL,
  socketServer: process.env.NODE_ENV === 'PRODUCTION' ? process.env.DEV_SOCKET_SERVER_URL : process.env.SOCKET_SERVER_URL
}

export default url