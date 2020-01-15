const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();


//searching database for users
const getUserWithEmail = function (email) {
  return db.query(
    `SELECT id, email
  FROM users
  WHERE email = $1`, [email])
    .then(function (res) {
      if (res) {
        user = res.rows[0];
      } else {
        user = null;
      }
      return user;
    })
}

const updateUserEmail = function (id, newEmail) {
  return db.query(
    `UPDATE users
   SET email = $1
   WHERE users.id = $2
   RETURNING *`, [newEmail, id])
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    })
}



const getUserWithId = function (id) {
  return db.query(
    `SELECT id, email
    FROM users
    WHERE id = $1`, [id])
    .then(function (res) {
      if (res) {
        user = res.rows[0];
      } else {
        user = null;
      }
      return user;
    })
}



const getResourcesOrderByCountRating = function () {
  return db.query(`SELECT * FROM resources
  JOIN ratings ON ratings.resource_id = resources.id
  WHERE resources.is_deleted = FALSE
  GROUP BY resources.id, ratings.id
  ORDER BY count(ratings.id)
  LIMIT 50;`)
  .then(data => {
    return data.rows;
  });
}

const getResourcesByTopicsForUser = function (id) {
  return db.query(`SELECT resources.*
    FROM user_topics
    JOIN topics_resources ON topics_resources.topic_id = user_topics.topic_id
    JOIN resources ON topics_resources.resource_id = resources.id
    JOIN likes ON resources.id = likes.resource_id
    WHERE user_topics.user_id = $1 AND likes.user_id <> $1;
    `, [id])
    .then(data => {
      return data.rows;
    });
}

const getResourcesByCreatedAt = function () {
  return db.query(`SELECT * FROM resources ORDER BY created_at DESC;`)
    .then(data => {
      return data.rows;
    });
}






//grabbing topic choices for sign up and upload page
const getAllTopics = function () {
  return db.query(
    `SELECT topics.id, topics.name
    FROM topics`)
    .then(res => {
      return res.rows;
    })
}

//adding a user to database

const addUser = function (email) {
  return db.query(
    ` INSERT INTO users (email)
     VALUES ($1)
     RETURNING *`, [email])
    .then(function (res) {
      return res.rows[0];
    })
}

//connecting topics to user upon signin
const addTopicsToUser = function (user_id, topic1, topic2, topic3) {
  return db.query(
    ` INSERT INTO user_topics (user_id, topic_id)
     VALUES ($1, $2), ($1, $3), ($1, $4)
     RETURNING *`, [user_id, topic1, topic2, topic3])
    .then(function (res) {
      console.log(res.rows);
    })
}

const getAllMyLikedResources = function (userId) {
  return db.query(
    `SELECT resources.*
    FROM resources
    JOIN likes ON likes.resource_id = resources.id
    WHERE likes.user_id = $1
     `, [userId])
    .then(res => {
      return res.rows;
    });
}

const getAllMyUploadedResources = function (userId) {
  return db.query(
    `SELECT resources.*
    FROM resources
    WHERE resources.created_by = $1`, [userId])
    .then(res => {
      return res.rows;
    });
}

//  ------  Resource id page functions  ------  //
const getResourceByID = (id) => {
  return db.query(`SELECT resources.* FROM resources WHERE resources.id = $1`, [id])
    .then(function (data) {
      return data.rows[0];
    })
}
exports.getResourceByID = getResourceByID;

const getCommentsByID = (id) => {
  return db.query(`SELECT comments.* FROM comments WHERE comments.resource_id = $1 ORDER BY created_at desc`, [id])
}

exports.getCommentsByID = getCommentsByID;

const getRatingByID = (id) => {
  return db.query(`SELECT ratings.* , (SELECT count(ratings.id) FROM ratings WHERE ratings.resource_id = 2)FROM ratings WHERE ratings.resource_id = $1
                  GROUP BY ratings.id`, [id])
}

exports.getRatingByID = getRatingByID;

const getLikesByID = (id) => {
  return db.query(`SELECT likes.* , (SELECT count(likes.id) FROM likes WHERE likes.resource_id = 2)FROM likes WHERE likes.resource_id = $1
                  GROUP BY likes.id`, [id])
}

exports.getLikesByID = getLikesByID;

const postComment = (resource_id, user_id, text) => {
  return db.query(`INSERT INTO comments (resource_id, user_id, text) values ($1, $2, $3);`, [resource_id, user_id, text]);
}

exports.postComment = postComment;



// const getTopicsByID = (id) => {
//   return db.query(`SELECT likes.* FROM likes WHERE likes.resource_id = $1
//                   GROUP BY likes.id`, [id])
// }

// exports.getTopicsByID = getTopicsByID;

const insertIntoLikes = function (userid, resourceid) {
  return db.query(`INSERT INTO likes (user_id, resource_id)
  VALUES ($1, $2)
  RETURNING *
  `, [userid, resourceid])
    .then(function (res) {
      console.log(res.rows)
    })
};


const insertIntoRatings = function(userid, resourceid) {
  return db.query(`INSERT INTO ratings (user_id, resource_id)
  VALUES ($1, $2)
  RETURNING *
  `, [userid, resourceid])
  .then(function(res) {
    console.log(res.rows)
  })
};

const getResourcesByTopicName = function(topicName) {
  return db.query(`SELECT resources.*
    FROM topics
    JOIN topics_resources ON topics_resources.topic_id = topics.id
    JOIN resources ON topics_resources.resource_id = resources.id
    JOIN ratings ON resources.id = ratings.resource_id
    WHERE topics.name LIKE '%' || $1 || '%'
    ORDER BY count(ratings.id);
  `, [topicName])
    .then(data => {
      return data.rows;
    });
}

const checkIfLiked = function (resourceId) {
  return db.query(`SELECT *
  FROM likes
  WHERE likes.resource_id = $1
  `, [resourceId])
    .then(data => {
      return data.rows
    })
}

const checkIfRated = function(resourceId) {
  return db.query(`SELECT *
  FROM ratings
  WHERE ratings.resource_id = $1
  `, [resourceId])
  .then(data => {
    return data.rows
  })
}

const deleteLiked = function (resourceId) {
  return db.query(`DELETE FROM likes WHERE likes.resource_id = $1`, [resourceId])
}



const getTopicsByUserId = function(id) {
  return db.query(
    `SELECT topics.id, topics.name
    FROM topics
    JOIN user_topics ON topics.id = user_topics.topic_id
    JOIN users ON users.id = user_topics.user_id
    WHERE users.id = $1`, [id])
  .then(res => {
    return res.rows;
  })
}





const deleteRated = function (resourceId) {
  return db.query(`DELETE FROM ratings WHERE ratings.resource_id = $1`, [resourceId])
}

const deleteUploadedResource = function(resourceId, createdBy) {
  return db.query(`DELETE FROM resources WHERE id = $1 AND created_by = $2`, [resourceId, createdBy])
}

exports.getResourcesByTopicName = getResourcesByTopicName;
exports.addTopicsToUser = addTopicsToUser;
exports.getResourcesOrderByCountRating = getResourcesOrderByCountRating;
exports.getResourcesByTopicsForUser = getResourcesByTopicsForUser;
exports.getResourcesByCreatedAt = getResourcesByCreatedAt;
exports.addUser = addUser;
exports.getAllTopics = getAllTopics;
exports.getUserWithId = getUserWithId;
exports.getUserWithEmail = getUserWithEmail;
exports.getAllMyLikedResources = getAllMyLikedResources;
exports.getAllMyUploadedResources = getAllMyUploadedResources
exports.getResourcesOrderByCountRating = getResourcesOrderByCountRating;
exports.getResourcesByTopicsForUser = getResourcesByTopicsForUser;
exports.getResourcesByCreatedAt = getResourcesByCreatedAt;
exports.insertIntoLikes = insertIntoLikes;
exports.updateUserEmail = updateUserEmail;
exports.checkIfLiked = checkIfLiked;
exports.deleteLiked = deleteLiked;
exports.getTopicsByUserId = getTopicsByUserId
exports.checkIfRated = checkIfRated;
exports.deleteRated = deleteRated;
exports.insertIntoRatings = insertIntoRatings;
exports.deleteUploadedResource = deleteUploadedResource;
