const express = require('express');
const router=express.Router();
const auth = require('../../middleware/auth');
const Profile=require('../../Profile');
const User=require('../../Users');
const { check, validationResult} = require('express-validator/check');
//@route GET api/profile/me
//@desc Get current users profile
//@access Private

router.get('/me', auth,async(req,res) => {
try{
    const profile=await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);

    if(!profile){
        return res.status(400).json({msg:'There is no profile for this user'});
    }

    res.json(profile);

}catch(err){
    console.log(err.message);
    res.status(500);
}
});

//@route POST api/profile
//@desc  Create or update user profile
//@access Private

router.post('/',[auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]],async (req,res)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //if found update it

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;

    //Build profile object
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills) {
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    profileFields.social={}
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(instagram) profileFields.social.instagram=instagram;
    if(linkedin) profileFields.social.linkedin=linkedin;

    try{
        let profile = await Profile.findOne({user:req.user.id});

        if(profile){
            profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
            return res.json(profile);
        }

        //Create

        profile=new Profile(profileFields);

        await profile.save();
        res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }


});

//@route POST api/profile
//@desc  Get all profiles
//@access Public

router.get('/',async(req,res)=>{
try{
    const profiles=await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);

} catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
}

});


//@route POST api/profile/user/:user_id
//@desc  Get profile by user id
//@access Public

router.get('/users/:user_id',async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'Profile not found'});
        res.json(profile);
    
    } catch(err){
        console.error(err.message);
        if(err.kind=='Objectid'){
            return res.status(400).json({msg:'Profile not found'});
        }
        res.status(500).send('Server error');
    }
    
    });


//@route DELETE api/profile/users/:user_id
//@desc  delete profiles user and posts
//@access Private

router.delete('/users/:user_id',async(req,res)=>{
    try{
        //Remove profile
        await Profile.findOneAndRemove({user:req.params.user_id});
        await User.findOneAndRemove({_id:req.params.user_id});
        res.json({msg:'User removed'});
    
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
    });

//@route Put api/profile/experience
//@desc  Add profile experience
//@access Private

router.put('/experience',[auth,
check('title','Title is required').not().isEmpty(),
check('company','Company is required').not().isEmpty(),
check('startDate','startDate date is required').not().isEmpty()


],async(req,res)=>{

const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});

}
const {
    title,
    company,
    location,
    startDate,
    endDate,
    current,
    description
}=req.body;

const newExp={
    title,
    company,
    location,
    startDate,
    endDate,
    current,
    description
}
try{
    const profile=await Profile.findOne({user:req.user.id});
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);

}catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
}
});

//@route DELETE api/profile/experience/:exp_id
//@desc  delete profiles experience
//@access Private

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        //Remove profile
        const profile=await Profile.findOne({user:req.user.id});
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
    });


//@route Put api/profile/education
//@desc  Add profile education
//@access Private

router.put('/education',[auth,
    check('Institution','Institution is required').not().isEmpty(),
    check('ExpectedYearOfGraduation','ExpectedYearOfGraduation is required').not().isEmpty(),
    check('MajorOfStudy','MajorOfStudy is required').not().isEmpty()
    
    
    ],async(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    
    }
    const {
        Institution,
        MajorOfStudy,
        Degree,
        ExpectedYearOfGraduation,
        current
    }=req.body;
    
    const newExp={
        Institution,
        MajorOfStudy,
        Degree,
        ExpectedYearOfGraduation,
        current
    }
    try{
        const profile=await Profile.findOne({user:req.user.id});
        profile.education.unshift(newExp);
        await profile.save();
        res.json(profile);
    
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
    });
    
    //@route DELETE api/profile/education/:edu_id
    //@desc  delete profiles education
    //@access Private
    
    router.delete('/education/:edu_id',auth,async(req,res)=>{
        try{
            //Remove profile
            const profile=await Profile.findOne({user:req.user.id});
            const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id);
            profile.education.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
        
        });

module.exports=router;