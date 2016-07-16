var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    console.log('test');
});
module.exports = router;
