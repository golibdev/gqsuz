const News = require('../models/newsModel')
const Product = require('../models/productModel')
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')

exports.home = async (req, res) => {
   try {
      const lang = req.session.lang || 'ru'

      if(req.url === '/' || (req.query.lang !== 'ru' && req.query.lang !== 'uz')) {
         return res.redirect(`?lang=${lang}`)
      }

      req.session.lang = req.query.lang

      const news = await News.find({}).sort({ createdAt: -1 }).limit(6).lean()

      res.render('home', {
         title: 'Home',
         news,
         lang: req.query.lang
      })
   } catch (err) {
      console.log(err)
   }
}

exports.dashboard = async (req, res) => {
   try {
      const count = await News.countDocuments()
      const limit = 10
      const page = parseInt(req.query.page)

      if(req.url === '/dashboard') {
         return res.redirect(`?page=1`)
      }

      const news = await News.find()
         .skip((page - 1) * 10)
         .limit(10)
         .sort({ createdAt: -1 })
         .lean()

      res.render('admin/dashboard', {
         title: 'Dashboard',
         count,
         news,
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(count/limit)
         }
      })
   } catch (err) {
      console.log(err)
   }
}

exports.allNews = async (req, res) => {
   try {
      const lang = req.session.lang || 'ru'
      const count = await News.countDocuments()
      const limit = 10
      const page = parseInt(req.query.page)

      if(req.url === '/news') {
         return res.redirect(`?page=1&lang=${lang}`)
      }

      const news = await News.find()
         .skip((page - 1) * 10)
         .limit(10)
         .sort({ createdAt: -1 })
         .lean()

      res.render('news', {
         title: 'Dashboard',
         count,
         news,
         lang,
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(count/limit)
         }
      })
   } catch (err) {
      console.log(err)
   }
}

exports.addNews = async (req, res) => {
   try {
      if(!req.files) {
         return req.flash('error', "Fayl yuklanmagan")
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')) {
         return res.status(400).json({ message: "Faqat rasm yuklang" })
      }

      if(image.size > process.env.MAX_UPLOAD_FILE_SIZE) {
         return res.status(400).json({ message: "Fayl hajmi 5mb dan katta bo'lmadi" })
      }

      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`
      
      image.mv(`public/uploads/news/${image.name}`, async err => {
         if(err) {
            return res.status(500).json({ 
               message: 'Fayl yuklashda xatolik yuz berdi', 
               err: err.message 
            })
         }
      })

      const {
         uzTitle,
         ruTitle,
         uzContent,
         ruContent
      } = req.body

      const uzSlugUrl = slugify(uzTitle, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })

      const ruSlugUrl = slugify(ruTitle, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })

      const news = await News.create({
         uzTitle,
         ruTitle,
         uzContent,
         ruContent,
         uzSlugUrl,
         ruSlugUrl,
         image: `/uploads/news/${image.name}`
      })

      await news.save()

      res.redirect('/dashboard')
   } catch (err) {
      console.log(err)
   }
}

exports.newsDetail = async (req, res) => {
   try {
      const lang = req.session.lang || 'ru'

      const slugUrl = req.params.slugUrl
      let news;

      if(lang === 'ru') {
         news = await News.findOne({ ruSlugUrl: slugUrl }).lean()
      } else {
         news = await News.findOne({ uzSlugUrl: slugUrl }).lean()
      }

      res.render('newsDetail', {
         title: news.ruTitle || news.uzTitle,
         news,
         lang
      })
   } catch (err) {
      console.log(err)
   }
}

exports.deleteNews = async (req, res) => {
   try {
      const id = req.params.id

      const news = await News.findById(id)

      const oldImage = path.join(__dirname, '..', `public${news.image}`)
      fs.unlinkSync(oldImage)

      await News.findByIdAndDelete(id)

      res.redirect('/dashboard')
   } catch (err) {
      console.log(err)
   }
}

exports.editNews = async (req, res) => {
   try {
      const id = req.params.id

      const news = await News.findById(id)

      if(req.files) {
         const image = req.files.image

         if(!image.mimetype.startsWith('image')) {
            return res.status(400).json({ message: "Faqat rasm yuklang" })
         }

         if(image.size > process.env.MAX_UPLOAD_FILE_SIZE) {
            return res.status(400).json({ message: "Fayl hajmi 10mb dan katta bo'lmadi" })
         }

         image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`

         const oldImage = path.join(__dirname, '..', `public${news.image}`)
         fs.unlinkSync(oldImage)

         image.mv(`public/uploads/news/${image.name}`, async err => {
            if(err) {
               return res.status(500).json({ 
                  message: 'Fayl yuklashda xatolik yuz berdi', 
                  err: err.message 
               })
            }
         })

         await News.findByIdAndUpdate(id, {
            image: `/uploads/news/${image.name}`
         })
      }

      const {
         uzTitle,
         ruTitle,
         uzContent,
         ruContent
      } = req.body

      const uzSlugUrl = slugify(uzTitle, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })

      const ruSlugUrl = slugify(ruTitle, {
         replacement: '-',
         remove: /[$*_+~.()'"!\-:@]/g,
         lower: true
      })


      await News.findByIdAndUpdate(id, {
         uzTitle,
         ruTitle,
         uzContent,
         ruContent,
         uzSlugUrl,
         ruSlugUrl
      })

      res.redirect('/dashboard')
   } catch (err) {
      console.log(err)
   }
}

exports.productPage = async (req, res) => {
   try {
      const count = await Product.countDocuments()
      const limit = 10
      const page = parseInt(req.query.page)

      if(req.url === '/dashboard/products') {
         return res.redirect(`?page=1`)
      }

      const products = await Product.find()
         .skip((page - 1) * 10)
         .limit(10)
         .sort({ createdAt: -1 })
         .lean()

      res.render('admin/products', {
         title: 'Dashboard - products',
         count,
         products,
         pagination: {
            page,
            limit,
            pageCount: Math.ceil(count/limit)
         }
      })
   } catch (err) {
      console.log(err)
   }
}

exports.addProduct = async (req, res) => {
   try {
      if(!req.files) {
         return req.flash('error', "Fayl yuklanmagan")
      }

      const image = req.files.image

      if(!image.mimetype.startsWith('image')) {
         return res.status(400).json({ message: "Faqat rasm yuklang" })
      }

      if(image.size > process.env.MAX_UPLOAD_FILE_SIZE) {
         return res.status(400).json({ message: "Fayl hajmi 5mb dan katta bo'lmadi" })
      }

      image.name = `photo_${new Date().getTime()}${path.parse(image.name).ext}`
      
      image.mv(`public/uploads/products/${image.name}`, async err => {
         if(err) {
            return res.status(500).json({ 
               message: 'Fayl yuklashda xatolik yuz berdi', 
               err: err.message 
            })
         }
      })

      const {
         code,
         ruContent,
         uzContent
      } = req.body

      const products = await Product.create({
         code,
         ruContent,
         uzContent,
         image: `/uploads/products/${image.name}`
      })

      await products.save()

      res.redirect('/dashboard/products')
   } catch (err) {
      console.log(err)
   }
}

exports.products = async (req, res) => {
   try {
      const lang = req.session.lang || 'ru'

      if(req.url === '/products') {
         return res.redirect(`/products?lang=${lang}`)
      }

      res.render('aboutCompany', {
         title: lang === 'ru' ? 'Товары' : 'Mahsulotlar',
         lang: lang
      })
   } catch (err) {
      console.log(err)
   }
}

exports.change = async (req, res) => {
   try {
      // change language
      if(req.query.lang === 'ru') {
         req.session.lang = 'ru'
         return res.redirect('?lang=ru')
      } else {
         req.session.lang = 'uz'
         return res.redirect('?lang=uz')
      }
   } catch (err) {
      console.log(err)
   }
}

exports.logout = (req, res) => {
   req.session.admin = undefined
   req.session.isLogged = false
   req.session.destroy()

   res.redirect('/admin')
}