/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require('express');
const passport = require("passport");
const session = require('express-session');

const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();

// Util modules
const chalk = require('chalk');
const log = console.log;

// TODO: Check for security measure which need to be done before
// TODO: express-session
// TODO: better frontend lmao
// TODO: Add routing system

// Run
exports.run = (client, config) => {

  /*
* App setup
*/

  // App view
  app.set('view engine', 'pug');
  app.set('views', './src/views');

  // Asset directories
  app.use('/static', express.static('./src/dist'));
  app.use('/static', express.static('./src/plugins'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  }));

  passport.use(new DiscordStrategy({
        clientID: client.user.id,
        clientSecret: config.clientSecret,
        callbackURL: config.redirectURI,
        scope: ["identify"]
      },
      function(accessToken, refreshToken, profile, done) {
        //Handle Database Query Addition Here.
        //console.log(profile);
        return done(null, profile);
      }
  ));

  passport.serializeUser(function(u, d) {
    d(null, u);
  });
  passport.deserializeUser(function(u, d) {
    d(null, u);
  });

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    guilds: client.guilds.size
  };

  /*
  * Routing
  */
  // Index page
  app.get('/', (req, res) => {
    if (!req.session.user) {
      res.redirect('/auth/discord');
    } else {
      res.render('index', {botInfo: botInfo, userInfo: req.session.user});
      //res.send(`Hello ${req.session.user.username}`);
    }
  });

  app.get("/auth/discord", passport.authenticate("discord.js"));
  app.get("/auth/discord/callback", passport.authenticate("discord.js", { failureRedirect: "/auth/discord/error" }), function(req, res) {
    //console.log(req.session.passport);
    req.session.user = req.session.passport.user;

    // Successful authentication, redirect home.
    res.redirect("/");
  });
  app.get('/test', (req, res) => {
    res.send(encodeURI(config.redirectURI));
  });

  // Listener
  app.listen(config.port, () => {
    log('INFO >> ' + chalk.green('Dashboard is running on port ' + config.port));
  });
}
