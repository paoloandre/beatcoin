module.exports = {
  // App Settings
  MONGO_URI: process.env.MONGO_URI || 'mongodb://admin:administrator@ds151544.mlab.com:51544/beatcoin',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'YOUR_UNIQUE_JWT_TOKEN_SECRET'
};
