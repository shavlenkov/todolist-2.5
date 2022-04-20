import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    },
})

const Items = mongoose.model('Items', itemsSchema);

export default Items;