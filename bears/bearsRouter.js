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
    db('bears')
      .then(bear => res.status(200).json(bear))
      .catch(err => res.status(500).json(err));
  }
});

// get single bear
router.get('/:id', (req, res) => {
  db('bears')
    .where({id: req.params.id})
    .then(bear => {
      if (!bear.length) {
        res.status(400).json({error: 'there is no bear with that id'});
      } else res.status(200).json(bear);
    })
    .catch(err => res.status(400).json(err));
});

// post bear
router.post('/', (req, res) => {
  const {name} = req.body;
  if (!name) {
    res.status(400).json({error: 'the bear must contain a name'});
  } else {
    db('bears')
      .insert(req.body)
      .then(id => {
        res.status(201).send(id);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

// delete bear
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  db('bears')
    .where({id: id})
    .del()
    .then(count => {
      if (!count) {
        res.status(400).json({error: 'there is no bear with that id'});
      } else {
        res.status(200).json({message: 'the bear has been deleted'});
      }
    });
});

// update bear
router.put('/:id', (req, res) => {
  const changes = req.body;
  console.log(changes);
  console.log(req.params.id);

  db('bears')
    .where({id: req.params.id})
    .update(changes)
    .then(count => {
      if (!count) {
        res.status(400).json({error: 'there is no bear with that id'});
      } else {
        res.status(200).json({message: 'the bear has been updated'});
      }
    })
    .catch(err => res.status(500).json({error: `there was an error: ${err}`}));
});

module.exports = router;
