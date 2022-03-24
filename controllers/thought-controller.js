const { User, Thought } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'Nothing found with this ID' });
        return;
      }
      res.json(dbThoughtData)
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  createThought({ params, body }, res) {
    Thought.create(body)
    .then(({ _id }) => {
      return Thought.findOneAndUpdate(
        { _id: params.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user with this ID' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => err.json(err));
  },

  
}

module.exports = thoughtController;