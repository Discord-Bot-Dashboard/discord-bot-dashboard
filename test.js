/**
 * This test file is used to test the basic functionality of the dashbaord.
 * It is also here to serve as an example implementation of the module.
 */
const { Client } = require("discord.js");
require("dotenv").config();
const Dashboard = require("./index");

/**
 * Create an instance of a Discord client
 */
const client = new Client();

const dashboard = new Dashboard(client, {
    port: 8080,
    clientSecret: process.env.clientSecret,
    redirectURI: `http://localhost:8080/auth/discord/callback`,
    websiteDomain: "http://localhost:8080",
});

client.on("ready", () => {
    console.log("Hello world!");
    dashboard.run();
});

client.login(process.env.TOKEN);
