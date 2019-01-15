const express = require('express');
const helmet = require('helmet');
//const knex = require('knex');
//const knexConfig = require('./knexfile.js');
const zoosRouter = require('./zoos/zoosRouter');
const bearsRouter = require('./bears/bearsRouter');

const server = express();
//const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/', (req, res) => {
  res.send('sanity check');
});

server.use('/api/zoos', zoosRouter);
server.use('/api/bears', bearsRouter);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
