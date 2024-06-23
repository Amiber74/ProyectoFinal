import passport from "passport";
import googlePassport from 'passport-google-oauth20'
import config from "./config.js";
import { userServices } from "../services/userServices.js";

const Strategy = googlePassport.Strategy
const US = new userServices()

const initializeGoogle = () => {
    passport.use('google', new Strategy({
            clientID: config.googleClientId,
            clientSecret: config.googleClientSecret,
            callbackURL: `http://localhost:${config.port}/api/user/auth/google/callback`,
        },
        async function(accessToken, refreshToken, profile, done){
            try {

                const user = await US.getUserByEmail(profile._json.email) 
                if(user){
                    await US.updateConnection(user._id)
                    return done(null, user)
                }

                const result = await US.createUser(
                    profile._json.given_name.split(' ')[0],
                    profile._json.family_name.split(' ')[0],
                    profile._json.email,
                    ' ',
                    '',
                    profile._json.picture
                )

                return done (null, result)
            } catch(err) {
                return done('Error al loguearse con Google')
            }
        }

    ))

    passport.serializeUser( (user, done) => {
        done(null, user)
    })

    passport.deserializeUser( async (user, done) => {
        // const user = await US.getUserBy_Id(id)
        done(null, user)
    })
}

export default initializeGoogle
