var express 	= require('express');
var router 		= express.Router();
var users 		= require('./users');
var auth 		= require('./auth');
var voting 		= require('./voting');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', users.login);

router.post('/createPoll',auth.validateUser, voting.createPoll);
router.post('/listPoll',auth.validateUser, voting.listPoll);
router.post('/viewPollById',auth.validateUser, voting.viewPollById);
router.post('/removePoll',auth.validateUser, voting.removePoll);
router.post('/vote',auth.validateUser, voting.vote)



module.exports = router;
