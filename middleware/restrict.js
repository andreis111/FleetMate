module.exports = {
    checkRestrict(req, res, next) {
        // Check if the user is logged in
        if (!req.user) {
            return res.redirect("/login");
        }
    
        // Check if the user's role is "demo"
        if (req.user.email === 'admin@a.com') {
            return res.redirect("/admin/access-denied");
         }
  
        // If the user is logged in and their role is not "demo", allow them to proceed
        next();
    }
}