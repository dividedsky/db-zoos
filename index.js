const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/', (req, res) => {
  res.send('sanity check');
});

server.get('/api/zoos');

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

// get zoos
server.get('/api/zoos', (req, res) => {
  const {name} = req.body;
  if (!name) {
    res
      .status(400)
      .json({error: 'the body of the request must contain a name'});
  } else {
    db('zoos')
      .then(zoo => res.status(200).json(zoo))
      .catch(err => res.status(500).json(err));
  }
});

// get single zoo
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({id: req.params.id})
    .then(zoo => {
      if (!zoo.length) {
        res.status(400).json({error: 'there is no zoo with that id'});
      } else res.status(200).json(zoo);
    })
    .catch(err => res.status(400).json(err));
});
