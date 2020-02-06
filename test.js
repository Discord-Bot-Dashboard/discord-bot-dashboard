/*****
 * This test file is only temporarily.
 * It is here just to test the basic functionality.
*/
const { Client } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config(); // Create a .env file or include your own config file

//import run from "./index.js"; //require dashboard
const Dashboard = require("./index");

// Create an instance of a Discord client
const client = new Client();
//const oAuth = Discord.OAuth2Application;

//const { OAuth2Application } = require('discord.js');

const dashboard = new Dashboard(client, {
  port: 4000, 
  clientSecret: process.env.clientSecret, 
  redirectURI: "http://localhost:4000/auth/discord/callback"
});

// Ready event of the Client
client.on('ready', () => {
  
  dashboard.run();
  //run(client, {port: 4000, clientSecret: process.env.clientSecret, redirectURI: "http://localhost:4000/auth/discord/callback"});
  console.log('INFO >> ' + chalk.green('Bot is online'));

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.TOKEN);