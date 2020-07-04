const express = require('express');
const router = express.Router();
const {ensureAuth}  =require('../middleware/auth') 
//@desc  Login page
const Story = require('../models/Story')
router.get('/add', ensureAuth, (req, res) => {

    res.render('stories/add')
})


router.post('/', ensureAuth,async (req, res) => {

    try {
        
      req.body.user = req.user.id

       await Story.create(req.body)
       res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
})
router.get('/', ensureAuth,async (req, res) => {



     try {
         
           const Stories  = await Story.find({status:'public'})
          .populate('user')
          .sort({createdAt:'desc'})
          .lean()

          res.render('stories/index',{
              Stories,
          })
     } catch (error) {
         console.log(error);
         
     }
    
})




module.exports = router;