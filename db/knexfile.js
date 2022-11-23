
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'mydb'
    },
    jwt: 'jwt-key',
    expressPort: 3000,
    socketPort: 3500
  }
};
