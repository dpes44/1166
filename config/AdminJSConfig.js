const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')

// Load User model
const User = require('./models/Users');
const Role = require('./models/Role');
const Permission = require('./models/Permission');