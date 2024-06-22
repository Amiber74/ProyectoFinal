import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlTest: process.env.MONGO_URL_TEST,
    mongoKey: process.env.MONGO_KEY,
    cookieKey: process.env.COOKIE_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
}