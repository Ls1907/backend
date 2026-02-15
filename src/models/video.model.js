import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
  {
    videofile: {
        type:String,
        required : true
    },

    thumbnail : {
        type:String,
        required :true,
        trim: true
    },

    owner: {
        type : Schema.Types.ObjectId,
        ref : "User"

    },
     
    title : {
        type: String,
        required : true,
        trim :true
    },
    description:{
        type : String,
        required :true
    },
    duration : {
        type : Number,
        required : true
    },
    views :{
        type :Number,
        default : 0
    },
    ispublished:{
        type : Boolean,
        required : true
    }
  },{
    timestamps: true
  }
);


videoSchema.plugin(mongooseAggregatePaginate)
export const video = mongoose.model("Video", videoSchema);
