const Usershcema=require('./Model/User');
//da file el ana b3ml fe config el bn3ml feh el stratgy
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.use(new GoogleStrategy({
    clientID: "110170152052-oj1djels192uufjdvidncqflsoa9n27n.apps.googleusercontent.com",
    clientSecret: "SwWFYycj85Jjsqyc6P4iBwv2",
    callbackURL: "/account/google/callback"
},

   async function (accessToken, refreshToken, profile, done) {
      const user=await Usershcema.findOne({IdGoogle:profile.id})
      if(user)
      {
          return done(null,user);
      }
      else
      {
        const newuser=new Usershcema({
            Role:"User",
            Name:profile.displayName,
            IdGoogle:profile.id,
            
        });
        newuser.save();
        return done(null,newuser);
      }
    }
));