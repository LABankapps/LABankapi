module.exports = {
  // Configuring Mailgun API for sending transactional email
  mailgun_priv_key: 'key-d5d9822842ea0f638cda948695e5b204',
  // Configuring Mailgun domain for sending transactional email
  mailgun_domain: 'www.labank.cc',
  // Secret key for JWT signing and encryption
  'secret': '123456',
  // Database connection information
  'uri': 'mongodb://localhost:27017/LABankapi',
  // mongoose option
  'option': {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  },
  // Setting port for server
  'port': process.env.PORT || 8000
}
