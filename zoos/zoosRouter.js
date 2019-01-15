const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const router = express.Router();

router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  db('zoos')
    .where({id: req.params.id})
    .then(zoo => {
      if (!zoo.length) {
        res.status(400).json({error: 'there is no zoo with that id'});
      } else res.status(200).json(zoo);
    })
    .catch(err => res.status(400).json(err));
});

// post zoo
router.post('/', (req, res) => {
  const {name} = req.body;
  if (!name) {
    res.status(400).json({error: 'the zoo must contain a name'});
  } else {
    db('zoos')
      .insert(req.body)
      .then(id => {
        res.status(201).send(id);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

// delete zoo
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  db('zoos')
    .where({id: id})
    .del()
    .then(count => {
      if (!count) {
        res.status(400).json({error: 'there is no zoo with that id'});
      } else {
        res.status(200).json({message: 'the zoo has been deleted'});
      }
    });
});

// update zoo
router.put('/:id', (req, res) => {
  const changes = req.body;
  console.log(changes);
  console.log(req.params.id);

  db('zoos')
    .where({id: req.params.id})
    .update(changes)
    .then(count => {
      if (!count) {
        res.status(400).json({error: 'there is no zoo with that id'});
      } else {
        res.status(200).json({message: 'the zoo has been updated'});
      }
    })
    .catch(err => res.status(500).json({error: `there was an error: ${err}`}));
});

module.exports = router;
