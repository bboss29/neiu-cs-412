const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true
    },
    isAdmin: {
        type: Boolean
    },
    works: [
        {
            type: SchemaTypes.ObjectID,
            ref: 'Work'
        }
    ],
    links: [
        {
            type: SchemaTypes.ObjectID,
            ref: 'Link'
        }
    ]
})

UserSchema.set('toJSON', { getters: true, virtuals: true })
UserSchema.set('toObject', { getters: true, virtuals: true })

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'username'
})

UserSchema.pre('save', async function(next){
    let user = this
    try {
        if (!user.isAdmin) user.isAdmin = false
    } catch (error) {
        console.log(`Error in creating user`)
    }
})

exports.User = mongoose.model('users', UserSchema)