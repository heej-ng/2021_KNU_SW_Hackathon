module.exports = (req, res) =>{
    req.session.userId =null;
    return res.redirect('/')
}