const mongoose=require('mongoose');

const ProfileSchema=new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
company:{
type:String
},
website:{
    type:String
},
Country:{
    type:String
},
State:{
    type:String
},
City:{
    type:String
},
status:{
    type:String,
    required:true
},
skills:{
    type:[String],
    required:true
},
bio:{
    type:String
},
githubusername:{
    type:String
},
experience:[
    {
        title:{
            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        },
        location:{
            type:String
        },
        startDate:{
            type:Date,
            required:true
        },
        endDate:{
            type:Date,
            required:true
        },
        description:{
            type:String
        },
        current:{
            type:Boolean,
            default:false
        }
    }
],
education:[
    {
        Institution:{
            type:String,
            required:true
        },
        MajorOfStudy:{
            type:String
        },
        Degree:{
            type:String
        },
        ExpectedYearOfGraduation:{
            type:Date
        },
        current:{
            type:Boolean,
            default:false
        }
    }
],
date:{
    type:Date,
    default:Date.now
}

});

module.exports=Profile=mongoose.model('profile',ProfileSchema);