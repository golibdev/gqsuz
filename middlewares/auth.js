exports.isAuth = (req, res, next) => {
   if(req.session.isLogged) {
      return res.redirect('/dashboard')
   }

   next()
}

// redirect from admin route to auth route
exports.redirectToAuth = (req, res, next) => {
   if(req.url === '/admin') {
      return res.redirect('/auth/login')
   }

   next()
}

exports.protected = (req, res, next) => {
   if(!req.session.isLogged) {
      return res.redirect('/auth/login')
   }

   next()
}