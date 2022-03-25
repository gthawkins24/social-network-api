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

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
    { _id: params.thoughtId }, 
    body, 
    { new: true, runValidators })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.status(500).json(err);
      console.log(err);
    })
  },

  removeThought({ params, body }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
    .then(deletedThought => {
      if (!deletedThought) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughId } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      res.status(500).json(err);
      console.log(err);
    })
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this ID' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.status(500).json(err);
      console.log(err);
    })
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { runValidators: true, new: true }
    )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
  }
};

module.exports = thoughtController;