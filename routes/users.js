const express = require('express');
const router = express.Router();

var pgp = require('pg-promise')();
var cn = "postgres://postgres:admin@localhost:5432/postgres";
var db = pgp(cn);

/* GET users listing. */
router.get('', function(req, res, next) {

    db.manyOrNone('SELECT * FROM users ORDER BY id ASC;')
        .then(function (users) {
            console.log(users); // print user name;
            return res.json({data: users});
        })
        .catch(function (error) {
            console.log(error); // print why failed;
            return res.status(500).json({success: false, data: error});
        });

    //res.send('GET users list');
});

router.get('/:id', function(req, res, next) {

    var id = req.params.id;

    db.oneOrNone('SELECT * FROM users WHERE id=($1)',id)
        .then(function (user) {
            console.log(user); // print user name;
            return res.json({data: user});
        })
        .catch(function (error) {
            console.log(error); // print why failed;
            return res.status(500).json({success: false, data: error});
        });

    //res.send('GET user by id');
});

router.post('', function(req, res, next) {

    var data = req.body;
    console.log(data);

    db.one("INSERT INTO users(${this~}) VALUES( ${name}, ${surname}, ${birth_date}, ${gender}, ${email}, ${position}, ${project} ) RETURNING *", data)
        .then(function (user) {
            console.log(user); // print user name;
            return res.json({data: user});
        })
        .catch(function (error) {
            console.log(error); // print why failed;
            return res.status(500).json({success: false, data: error});
        });

   // res.json(data);
});

router.put('/:id', function(req, res, next) {

    var data = req.body;
    console.log(data);

    db.one('UPDATE users SET (${this~})=(  ${id}, ${name}, ${surname}, ${birth_date}, ${gender}, ${email}, ${position}, ${project} ) WHERE id=${id} RETURNING *', data )
        .then(function (user) {
            return res.json({data: user});
        })
        .catch(function (error) {
            console.log(error); // print why failed;
            return res.status(500).json({success: false, data: error});
        });

    //res.send('PUt user');
});

router.delete('/:id', function(req, res, next) {

    var id = req.params.id;

    db.one('DELETE FROM users WHERE id=($1) RETURNING *',id)
        .then(function (user) {
            return res.json({data: user});
        })
        .catch(function (error) {
            console.log(error); // print why failed;
            return res.status(500).json({success: false, data: error});
        });

    //res.send('DELETE user');
});

module.exports = router;
