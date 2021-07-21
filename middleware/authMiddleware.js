const User = require('../models/User')

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user)=>{
        if(error || !user) {
            req.session.returnTo = req.path
            if(req.path.includes('newcomment')){
                req.session.returnTo = req.session.returnTo.replace('/newcomment', '')
                
            }
            return res.redirect('/auth/login')
        }

        next()
    })
}