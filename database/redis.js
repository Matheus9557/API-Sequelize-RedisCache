require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
    url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

(async ()=>{
    await client.connect();
})();

module.exports = client;