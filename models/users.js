const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean
    },
    works: [
        {
            type: SchemaTypes.ObjectID,
            ref: 'Work'
        }
    ]
})

UserSchema.pre('save', async function(next){
    let user = this
    try {
        user.password = await bcrypt.hash(user.password, 10)
        if (!user.isAdmin)
            user.isAdmin = false
    } catch (error) {
        console.log(`Error in hashing password: ${error.message}`)
    }
})

UserSchema.methods.passwordComparison = async function(inputPassword) {
    let user = this
    return await bcrypt.compare(inputPassword, user.password)
}

exports.User = mongoose.model('users', UserSchema)