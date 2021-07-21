module.exports = (req, res, next)=>{
    if(req.body.title == ""||req.body.deadline==null){
        return res.redirect('/')
    }
    next()
}