const envBuild = {
  'server': [
    'PORT=1337'
  ],
  'client': [
    'NODE_ENV=DEVELOPMENT',
    'REST_SERVER_URL=http://localhost:3396',
    'SOCKET_SERVER_URL=http://localhost:4155',
    'OAUTH_SERVER_URL=http://localhost:4990'
  ]
};

module.exports = envBuild;
