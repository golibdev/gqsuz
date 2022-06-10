const Admin = require('../models/adminModel')
const News = require('../models/newsModel')
const CryptoJS = require('crypto-js')

exports.loginPage = async (req, res) => {
   try {
      const lang = req.session.lang || 'ru'

      if(req.url === '/login') {
         return res.redirect(`?lang=${lang}`)
      }

      res.render('admin/login', {
         title: 'Login',
         err: req.flash('err'),
         lang: req.query.lang
      })
   } catch (err) {
      console.log(err)
   }
}

exports.login = async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body

      const admin = await Admin.findOne({ username })
      const lang = req.session.lang || 'ru'

      if(!admin) {
         if(lang === 'ru') {
            req.flash('err', 'Неверный логин или пароль')
         } else {
            req.flash('err', "Ma'lumotlar mos kelmadi")
         }
         return res.redirect('/auth/login')
      }

      const decryptedPass = CryptoJS.AES.decrypt(
         admin.password,
         process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)

      if(password !== decryptedPass) {
         if(req.query.lang === 'ru') {
            req.flash('err', "Ошибка имени пользователя или пароля")
         } else {
            req.flash('err', "Foydalanuvchi nomi yoki parol xato")
         }
         return res.redirect('/auth/login')
      }
      
      req.session.admin = admin
      req.session.isLogged = true
      req.session.save()

      res.redirect('/dashboard')
   } catch (err) {
      console.log(err)
   }
}