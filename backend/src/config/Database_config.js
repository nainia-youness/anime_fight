var mysql = require('mysql');
const redis = require('redis')

const redis_client=redis.createClient()


redis_client.on('error', err => {
  console.log('Error ' + err);
})

var con = mysql.createPool({
        connectionLimit : 100, 
        host: "localhost",
        user: "root",
        password: "",
        database: 'anime_fight_db',
        multipleStatements: true
      });

module.exports ={
    con,redis_client
}
