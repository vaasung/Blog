const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  mongoose = require('mongoose'),
  fileUpload = require('express-fileupload'),
  session = require('express-session'),
  connectMongo = require('connect-mongo'),
  connectFlash = require('connect-flash'),
  router = express.Router()

const Post = require('./database/models/post'),
  User = require('./database/models/user'),
  Comment = require('./database/models/comments'),
  Topics = require('./database/models/topics'),
  Tags = require('./database/models/tags')



//max-old-space-size=4096 fileneme.js

require('dotenv').config()

const blog = express()

console.clear()
console.log(''.padEnd(180, '#'))

const mongoStore = connectMongo(session)

mongoose
  .connect('mongodb://localhost:27017/blog')
  .then(d => {
    console.log(
      `Mongo DB started... \n${d.connections[0].name.toUpperCase()} database connected...`
    )
  })
  .catch(e => {
    console.log(e, ' Mongo DB error')
  })

blog.use(
  session({
    name: 'mySecretCookieRecipe',
    secret: 'nameisname',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true // 'true' should be for production especially for 'https'
      // expires: 60,
      // maxAge: 0 * 0 * 0 * 60
    },

    store: new mongoStore({
      mongooseConnection: mongoose.connection
      // ttl: 0 * 0 * 0 * 60
    })
  })
)

blog.engine('html', require('ejs').renderFile)
blog.set('view engine', 'html')
blog.set('views', path.join(__dirname, 'client/templates'))

// blog.set('view engine', 'ejs')

const midd = (req, res, next) => {
  console.log('Hello from Middleware')
  next()
}

blog.use(fileUpload())
blog.use('/cl', express.static(path.resolve(__dirname, 'client')))
blog.use([
  express.json(),
  express.urlencoded({
    extended: true,
    maxAge: 1000
  })
])
blog.use(connectFlash())



const isAuth = (request, response, next) => {
  if (!request.session.userId) {
    // return response.redirect(401, '/login')
    // return response.send(401).location('/login').end()
    return response.status(401).redirect('/login')
  }
  User.findById(request.session.userId)
    .select('firstName lastName email')
    .then(d => {
      request.userName = d.firstName
      request.email = d.email
      // console.log(d._id, '---', request.session.userId)
      if (d._id == request.session.userId) {
        // console.log('Yes bot  r same')
      }
    })
    .catch(e => {
      console.log(e)
    })
  next()
}

// blog.use('/admin', auth)

// blog.use('/post/:id', function (req, res, next) {

// return path.join('.', 'post', req.params.file).apply(this, arguments);
// });

blog.get('/', (request, response) => {
  // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
  // response.send('888')
  // response.sendFile(path.resolve(__dirname, 'client/index.html'))
  response.render('index', {
    title: 'BlogR© Home Page'
  })
})

let getUser = async request => {
  if (!request.session.userId) {
    return ''
  } else {
    const user = await User.findById({
      _id: request.session.userId
    })
    return user
  }
}

blog.get('/post/:id', async (request, response) => {
  const post = await Post.findById({
    _id: request.params.id
  }).populate('author comments')

  response.render('pages/post', {
    title: 'Single Post',
    post,
    user: await getUser(request)
  })
})


// Comments
blog.post('/post/comment', async (request, response) => {
  const data = request.body
  data.post = request.body.postId
  data.author = request.session.userId || mongoose.Types.ObjectId()

  const post = await Post.findById(request.body.postId),
    user = await User.findById(data.author)

  Comment.create(data)
    .then(async data => {

      post.comments.push(data._id)
      post.save()

      user.comments.push(data._id)
      user.save()

      response.redirect('/post/' + post._id)
    })
    .catch(error => {
      console.log(error)
      response.redirect('/post/' + post._id)
    })
})


blog.get('/register', (request, response) => {
  response.render('pages/register', {
    title: 'User Registration',
    registerError: request.flash('registerError'),
    formData: request.flash('formData')[0]
  })
})

blog.post('/user/register', (request, response) => {
  const body = request.body
  User.create(body)
    .then(d => {
      // console.log(d)
      response.redirect('/login')
    })
    .catch(e => {
      let registerError = Object.keys(e.errors).map(k => e.errors[k].message)
      request.flash('registerError', registerError)
      request.flash('formData', request.body)
      response.redirect('/register')

      // response.send(Object.keys(e.errors).map(k => e.errors[k].message))
    })
})

blog.get('/admin', isAuth, async (request, response) => {
  // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
  // response.send('888')
  // response.sendFile(path.resolve(__dirname, 'client/index.html'))

  let topics = await Topics.find({})


  response.render('pages/add_post', {
    title: 'Adding Post',
    topics
  })
})

blog.get('/login', (request, response) => {
  response.render('pages/login', {
    title: 'Login Page',
    loginError: request.flash('loginError')
  })
})

blog.post('/user/login', (request, response) => {
  const {
    email,
    password
  } = request.body

  if (!email || !password) {
    // return response.send('Emai and password required...')
    request.flash('loginError', 'Email or Password Required')
    response.redirect('/login')
  } else {
    User.findOne({
        email: email
      })
      // .select('firstName lastName')
      .then(user => {
        if (user) {
          user
            .verifyPassword(password)
            .then(valid => {
              if (valid) {
                request.session.userId = user._id
                response.redirect('/posts')
              } else {
                request.flash('loginError', 'Passwrod wrong')
                response.redirect('/login')
                // return response.send('Passwrod wrong')
              }
            })
            .catch(e => {
              request.flash('loginError', 'Wrong')
              response.redirect('/login')
              console.log('Error  ', e)
              // return response.send('Wrong User')
            })
        } else {
          request.flash(
            'loginError',
            'You r not registerd yet <a href="/register">Register</a>'
          )
          response.redirect('/login')
        }
      })
      .catch(e => {
        console.log(e)
        response.send('Error:' + e)
      })
  }
})

blog.get('/logout', (request, response) => {
  if (request.session.userId) {
    request.session.destroy((e, b) => {
      response.redirect('/login')
      // return response.send('Hello I am logout... <a href="/login">Login</a>')
      console.log('logout ')
    })
  } else {
    return response.send(
      'Hello first of all you are not logged in, den how can u logout... <a href="/login">Login</a>'
    )
  }
})

blog.get('/posts', async (request, response) => {
  // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
  // response.sendFile(path.resolve(__dirname, 'client/index.html'))

  const posts = await Post.find({})
    .populate('author')
    .sort({
      createdAt: -1
    })

  // console.log(request.session, '\n--------------')
  response.render('pages/posts', {
    title: 'Post',
    active: true,
    posts
  })
})

blog.post('/post/add', isAuth, async (request, response) => {

  let data = request.body
  const {
    poster
  } = request.files
  data.image = poster.name

  let user = await User.findOne({
      _id: request.session.userId
    }),
    topic = await Topics.findOne({
      title: data.topics
    })

  data.author = request.session.userId
  data.topic = topic._id



    Post.create(data)
      .then(d => {
        console.log('POST ', d)
        user.posts.push(d._id)
        user.save()

        poster.mv(
          path.resolve(
            __dirname,
            `client/files/images/post_images/${d._id}_${data.image}`
          ),
          error => {
            if (error) {
              console.log(error)
            }
            // update imagename
            Post.findByIdAndUpdate({
                _id: d._id
              }, {
                $set: {
                  image: `files/images/post_images/${d._id}_${data.image}`
                }
              })
              .then(e => console.log('image succefully added '))
              .catch(e => console.log(e))
          }
        )

        return response.redirect('/posts')
      })
      .catch(e => {
        // return response.send(e.message)
        return response.end('Error :- ' + e)
      })
    console.log(data)
    // response.send(data)

})

blog.get('/user/dashboard', isAuth, async (request, response) => {
  let user = await User.findById(request.session.userId)

  let tag = await Tags.find()


  console.log(tag)

  response.render('user/dashboard', {
    title: 'User Dashboard',
    name: 'dashboard',
    user
  })
})

/*
// Middleware demo
blog.get('/wow', (req, res, next) => {
  console.log('THis is response 1')
  next()
}, (req, res, next) => {
  console.log('THis is response 2')
  next()
}, (req, res, next) => {
  console.log('THis is response 3')
  next()
}, (req, res, next)=>{
  res.send('3rd send')
})
*/

blog.get('/user/post', isAuth, async (request, response) => {
  // console.log(request.url) // !!Make active button later
  let user = await User.findById(request.session.userId)
  let post = await Post.find({
    author: request.session.userId
  }).sort('-createdAt')
  //.comment('Just comments')

  console.log('USER ', request.userName)

  // let m = post.map((v, i) => {
  //     return v.title += ' 66666666'
  // })

  // console.log(m)

  // console.log(post, 'POST')

  response.render('user/post', {
    title: 'User Posts',
    name: 'post',
    user,
    post
  })
})

blog.post('/updateProfile', (request, response) => {
  const {
    gender
  } = request.body

  User.findById(request.session.userId)
    .then(data => {
      if (data.profilePic.indexOf('/d/') != -1) {
        if (gender === 'Female') {
          data.profilePic = '/cl/files/images/profile_images/d/avatarF.png'
          data.save()
        } else if (gender === 'Male') {
          data.profilePic = '/cl/files/images/profile_images/d/avatarM.png'
          data.save()
        }
      }
      User.findByIdAndUpdate(request.session.userId, request.body)
        .then(d => console.log('Successfully Updated... '))
        .catch(e => console.log('Error On Update'))
    })
    .catch(error => {})
  response.redirect('/user/dashboard')
})

blog.post('/uploadProfile', (request, response) => {
  const {
    profileUPic
  } = request.files,
    profileImgName = `pro_${request.session.userId.slice(0, 10)}_${
      profileUPic.name
    }`


  profileUPic.mv(
    path.resolve(
      __dirname,
      `client/files/images/profile_images/${profileImgName}`
    ),
    error => {
      if (error) {
        console.log(error)
        return
      }
      User.findByIdAndUpdate(request.session.userId, {
          profilePic: `/cl/files/images/profile_images/${profileImgName}`
        })
        .then(d => console.log('Uploaded Profile image'))
        .catch(e => console.log('Error while uploading the profile image'))
    }
  )
  response.redirect(request.get('referer'))
})

blog.post('/uploadCover', (request, response) => {

  const {
    coverUPic
  } = request.files,
    profileImgName = `cov_${request.session.userId.slice(0, 10)}_${
      coverUPic.name
    }`

  coverUPic.mv(
    path.resolve(
      __dirname,
      `client/files/images/profile_images/${profileImgName}`
    ),
    error => {
      if (error) return
      User.findByIdAndUpdate(request.session.userId, {
          coverPic: `/cl/files/images/profile_images/${profileImgName}`
        })
        .then(d => {
          console.log('Cover Image Updated Successfully')
        })
        .catch(e => {
          console.log('Cover Image Not able to uploaded')
        })
    }
  )
  response.redirect(request.get('referer'));
})

blog.listen(process.env.PORT || 3000, () => {
  console.log(
    `               App is runing on the 'http(s)://${process.env.HOST}:${
      process.env.PORT
    }`
  )
})

process.on('SIGINT', () => {
  console.log('Bye!, Server closing'.padEnd(100, '.'))
  mongoose.disconnect()
  process.exit()
})
/*
const fileIndex = fs.readFileSync('./index.html'),
fileAbout = fs.readFileSync('./about.html', 'utf-8')
    
const server = http.createServer((req, res) => {
    // res.setHeader('Content-Type', 'text/plain')
    switch (req.url) {
        case '/favicon.ico':
        return
        break
        case '/':
        return res.end(fileIndex)
        break
        case '/about':
        res.write(fileAbout)
        return res.end()
        break
        case '/contact':
        return res.end('<h1>This is Contact page</h1>')
        default:
        res.writeHead(404)
        return res.end('No page found')
        break
    }
})
.listen(3000)
*/