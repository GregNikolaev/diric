module.exports = {
  DB: {
    name: 'diric',
    user: 'dbuser',
    pass: 'dbpass',
    opts: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      logging: console.log
    }
  },
  SERVER: {
    host: 'localhost',
    port: '8000',
    labels: ['api']
  }
}
