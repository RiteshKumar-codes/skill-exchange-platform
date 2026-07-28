const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    bio : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    
    skillsOffered : [String],
    skillsWanted : [String],
    rating : {
        type : Number,
        default : 0
    }
},
{
    timestamps: true
});

userSchema.index({city: 1});
userSchema.index({skillsOffered: 1});
userSchema.index({rating: -1});
userSchema.index({createdAt: -1});
userSchema.index({name: 1});



module.exports = mongoose.model("User",userSchema);