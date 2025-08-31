import mongoose, { model, Schema } from "mongoose";


const userSchema = new Schema({
email : {type: String, unique: true},
password: { type: String, required: true },
firstName: String,
lastName: String
})

export const userModel = model("user-details",userSchema)

const contentSchema = new Schema ({
    title: String,
    link: String,
    type: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'user-details', required: true},
},
{ timestamps: true } 
)

export const contentModel = model("content",contentSchema);

const linkSchema = new Schema({
    hash: String,
    userId: {
        type: mongoose.Types.ObjectId, ref: 'user-details', required: true, unique:true
    }

})
export const linkModel = model("link",linkSchema)