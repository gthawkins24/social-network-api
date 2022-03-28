const { User, Thought } = require('../models');
const { db } = require('../models/User');

const userController = {
  getAllUsers(req, res) {
    User.find({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      res.status(500).json(err);
    });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate('thoughts')
    .populate('friends')
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
  },

  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => {
      res.json(dbUserData)
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    })
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id },
      body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        res.status(400).json(err);
        console.log(err);
      });
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    })
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
    { _id: params.userId }, 
    { $push: { friends: params.friendId } }, 
    { runValidators: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        res.status(400).json(err);
        console.log(err)
      });
  },
}

module.exports = userController;