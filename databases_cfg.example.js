const dbs = {
  mydb: {
    config: {
      user: 'username',
      host: 'localhost',
      database: 'mydatabase',
      password: 'PASSWORD1',
      port: 5432,
      ssl: true,
      sslmode: 'require'
    },
    query: `select id, 'my_app' as app_name, domain, concat('https://', domain) as url from installations`
  },
  anotherdb: {
    config: {
      user: 'username',
      host: 'localhost',
      database: 'mydatabase2',
      password: 'PASSWORD1',
      port: 5432,
      ssl: true,
      sslmode: 'require'
    },
    query: `select id, 'sparkly_app' as app_name, domain, concat('https://', domain) as url from whatever`
  }
};

module.exports = dbs;