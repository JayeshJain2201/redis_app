const express = require('express');
const redis = require('redis');
const app = express();

const PORT = process.env.PORT || 5000;
const REDIS_HOST = 'redis_db';
const REDIS_PORT = process.env.PORT || 6379;
const { pool } = require('./db');

const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
redisClient.on('error', err => {
    console.error('Redis Error', err);
})
redisClient.connect();

app.use(express.json());

//to get the score id
app.get('/getScore/:id', async (req, res) => {
    const id = req.params.id;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM score_board WHERE id = $1', [id]);
    client.release();
    const score_d = result.rows[0];
    res.json(score_d);
  });

//to get the sum of scores of two id's
app.get('/ScoreSum/:id1/:id2', async (req, res) => {
    //creating ids
    const id1 = req.params.id1;
    const id2 = req.params.id2; 
    const client = await pool.connect(); //connect to client
    //get the scores from two ids
    const result1 = await client.query('SELECT score FROM score_board WHERE id = $1', [id1]);
    const result2 = await client.query('SELECT score FROM score_board WHERE id = $1', [id2]);
    //release the client
    client.release();

    const score1 = result1.rows[0].score;
    const score2 = result2.rows[0].score;
    const sum = score1 + score2; //sum of the two scores
    
    res.json({id1, id2, sum}); //output of sum in JSON format

});

//to inout the score to the db
app.post('/AddScore', async (req, res) => {
    const { id, first_name, last_name, score } = req.body; 
    const client = await pool.connect();
    //sending the query to the database
    const query = 'INSERT INTO score_board (id, first_name, last_name, score) VALUES ($1, $2, $3, $4)';
    const values =  [id, first_name, last_name, score];
    const result = await client.query(query, values);
    client.release();

    const cachedData = JSON.stringify(result.rows);
    await redisClient.set(`score:$id`, cachedData, 'EX', 600); //this will expire after 10 minutes = 600 seconds
    res.json({message: 'Score is added to the database successfully' });
})

app.listen(5000, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
})