
var mongoose = require('mongoose');
var mongooseAuth = require('mongoose-auth');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var UserModel;
var ScoreModel = require('./score.js');

var UserSchema = new Schema({
    scores: [ScoreModel]
});

UserSchema.plugin(mongooseAuth, {
    everymodule: {
        everyauth: {
            User: function () {
                return UserModel;
            }
        }
    },
    facebook: {
        everyauth: {
            myHostname: process.env.APP_HOST_NAME,
            appId: process.env.FB_APP_KEY,
            appSecret: process.env.FB_APP_SECRET,
            redirectPath: process.env.FB_CALLBACK
        }
    }
});

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
