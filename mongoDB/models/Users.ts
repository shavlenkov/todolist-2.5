import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },

})

const Users = mongoose.model('Users', usersSchema);

export default Users;