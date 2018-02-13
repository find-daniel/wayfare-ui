const envBuild = {
  'server': [
    'PORT=1337'
  ],
  'client': [
    'NODE_ENV=TEST',
    'REST_SERVER_URL=http://localhost:3396',
    'SOCKET_SERVER_URL=http://localhost:4155',
    'DEV_REST_SERVER_URL=http://54.183.137.202:3396',
    'DEV_SOCKET_SERVER_URL=http://54.183.137.202:4155',
    'GOOGLE_MAPS_API=',
    'GOOGLE_GEO_API='
  ]
};

module.exports = envBuild;
