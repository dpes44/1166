// models/User.js

const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
},{
  timestamps: true
});

module.exports = Permission = mongoose.model('permission', PermissionSchema);