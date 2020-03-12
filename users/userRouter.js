const express = require('express');

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(response => {
      res.status(201).json(response)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "error creating user"})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  req.body.user_id = req.user.id
  Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "error posting"})
    })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(response => {
      res.status(200).json(response)
    })
    .catch(error => {
      res.status(500).json({
        error: "The users information could not be retrieved. "
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then(response => {
      if (response) {
        res.status(200).json(response)
      }
      else {
        res.status(404).json({
          message: "The user with the specified ID does not exist. "
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The user information could not be retrieved. "
      })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "error fetching user posts"})
    })

});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
    .then(response => {
      res.status(200).json({message: "user has been deleted"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "error deleting user"})
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(updated => {
      res.status(201).json({message: "username has been updated successfully"})
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "error updating user"})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
      //console.log(user.id)
      if (user.id) {
        req.user = user;
      }
      next();
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: "invalid user id" })
    })
}

function validateUser(req, res, next) {
  // do your magic!
   console.log("user body", req.body)
  if (!req.body) {
    res.status(400).json({message: "missing user data"})
  }
  else if (!req.body.name) {
    res.status(400).json({message: "missing required name field"})
  }
  else {
    next();
  }

  // if (!req.body.name) {
  //   res.status(400).json({message: "missing required name field"})
  // }
  // else if (req.body.name) {
  //   next();
  // }
  // else {
  //   res.status(400).json({message: "missing user data"})
  // }

}

function validatePost(req, res, next) {
  // do your magic!
  console.log("user body", req.body)
  if (!req.body) {
    res.status(400).json({message: "missing post data"})
  }
  else if (!req.body.text) {
    res.status(400).json({message: "missing required text field"})
  }
  else {
    next();
  }
}

module.exports = router;
