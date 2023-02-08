const express = require('express')
const app = express()
const port = 3000
const passport = require('passport')
const session = require('express-session')
const { Strategy } = require('passport-discord')

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((obj, done) => done(null, obj))

passport.use(new Strategy({ 
    clientID: "", //Botun client idsi
    clientSecret: "", //Botun client secreti
    callbackURL: "http://localhost:3000/callback", //Botun callback urlsi çalışması için discord developer portalına girip botunuzun oauth2 kısmına bu urli redirects yerine yazmanız gerekiyor
    scope: ['identify', 'guilds'] //Giriş yapan kişinin izin vereceği izinler
}, (accessToken, refreshToken, profile, done) => process.nextTick(() => done(null, profile))))

app.use(session({ 
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

app.get('/login', passport.authenticate('discord', { scope: ['identify', 'guilds'] }), (req, res) => {})

app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => res.redirect('/index'))
app.get('/', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/login')
    res.render('pages/index', { user: req.user })
})

app.listen(port, () => console.log(`Selam ${port} portunda dinleniyorum!`))