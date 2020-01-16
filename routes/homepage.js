const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session.user_id;
    if (id) {
      res.redirect(`/${id}`)
    } else {
    db.getResourcesOrderByCountRating()
      .then(data => {
        console.log(data)
        const resource = { data: data };
        res.render('index', { resource });
      })
      .catch(err => {
        console.error(err);
      });
    }
  });

  router.post("/search", (req, res) => {
    const search = req.body.search.slice(1);
    let userId = parseInt(req.session.user_id);
    db.getResourcesBySearch(search)
      .then(data => {
        const resource = {data:data, userId:userId};
        res.render('index', { resource });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err.stack)
      });
  });

<<<<<<< HEAD


=======
>>>>>>> c2bc988b620415e395e5ba15f365e73d28758aff
  router.get("/:user_id", (req, res) => {
    const id = req.session.user_id;
    if (id) {
      let userId = parseInt(req.session.user_id);
      if (id === userId) {
        db.getResourcesByTopicsForUser(id)
          .then(data => {
            const resource = { data: data, userId: userId };
            res.render('index', { resource });
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        res.redirect("/")
      }
    } else {
      res.redirect("/")
    }
  });

<<<<<<< HEAD

=======
>>>>>>> c2bc988b620415e395e5ba15f365e73d28758aff
  router.put('/like/:resourceid', (req, res) => {
    const userId = parseInt(req.session.user_id);
    const resourceId = req.params.resourceid;
    db.checkIfLiked(resourceId, userId)
    .then(data => {
      if (data.length !== 0) {
        db.deleteLiked(resourceId)
        .then(data => {
          res.redirect(`/${userId}`);
        })
      } else {
        db.insertIntoLikes(userId, resourceId)
        .then(() => {
          db.getTopicsForResource(resourceId)
          .then(data => {
            const topics = data;
            for (let i = 0; i < topics.length; i++) {
              db.insertUserTopics(userId, topics[i].topic_id)
            }
            res.redirect(`/${userId}`);
          })
          .catch(err => {
            console.error(err);
            res.status(500).send(err.stack)
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err.stack)
        });
      }
    })

  });

  return router;
};


