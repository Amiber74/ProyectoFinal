import passport from "passport";
import githubPassport from 'passport-github2'
import config from "./config.js";
import { userServices } from "../services/userServices.js";

const Strategy = githubPassport.Strategy
const US = new userServices()

const initializeGitHub = () => {

    passport.use('github', new Strategy({
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: `http://localhost:${config.port}/api/user/auth/github/callback`
    },
        async function(accessToken, refreshToken, profile, done){
            
            try {

                const user = await US.getUserForGitHub(profile._json.login)
                if(user){
                    await US.updateConnection(user._id)
                    return done(null, user)
                }
                
                const newUser = await US.createUser(
                    profile._json.login,
                    ' ',
                    ' ',
                    ' ',
                    99,
                    profile._json.avatar_url
                )
                return done(null, newUser)
            } catch(err) {
                console.log(err)
                return done('Error al loguearse con Github')
            }

        }
    ))

    passport.serializeUser( (user, done) => {
        done(null, user)
    })

    passport.deserializeUser( (user, done) => {
        // const user = await userModel.findOne({_id:id})
        done(null, user)
    })
}

export default initializeGitHub