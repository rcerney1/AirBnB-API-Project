const router = require('express').Router();


//test 
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

router.get('/', (req, res) => {
    res.json('testing');
  });


module.exports = router;