const { Schema, mongoose } = require("mongoose")

const reactionschema = new Schema({
    reaction: {
        type: Number,
        default: 0,
        max: 1,
        min:-1
    },
    parent:String
    ,reactor: {
        type: mongoose.Types.ObjectId,
        ref:"user"
    }
})

const Reaction = mongoose.model("reaction", reactionschema)
module.exports=Reaction