# Shopify App Screenshotter

This grabs a list of rows of shopify app installations from a postgres database SQL query and makes screenshots of them in nice little folders.   

##  Quickstart
0. Clone this repo and run `yarn`, assuming you have yarn and node installed.
1. Copy and rename the databases_cfg.example.js to databases_cfg.js.
2. Modify the database credentials as needed. (Note that you only need one entry but two have been provided to illustrate how you can set up multiple configs.)


````     
const dbs = {
      mydb:{
        config:{
          user: 'username',
          host: 'localhost',
          database: 'mydatabase',
          password: 'PASSWORD1',
          port: 5432,
          ssl:true,
          sslmode:'require'
        },
        query:'select id, 'my_app' as app_name, domain, concat('https://', domain) as url from installations'
      },
     }
module.exports = dbs;
```` 

3. Modify the sql query for the database as needed.  See below for the columns the query needs.
4. Run the script using the database_cfg's key you want to use from the file you just made `node index.js mydb`

All the png screenshots will be put in the `output/app_name` folder.


## What about that SQL query bit?
The query for each db can be changed around as needed but needs to result in the following columns in any order:

| id | domain | url | app_name |
| --- | --- | --- | --- |
| any numeric id to help you order your screenshots | the domain for the shop (will be the file name) | the url of the page the take the screenshot, usually just the domain | the name of the app, will be the name of the output subfolder |  
