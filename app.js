import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/db.js'
import {router} from './router/router.js'

const app = express()
dotenv.config({path: '.env'})
const port = process.env.PORT || 3001

app.use(express.json())
app.use(router)

connectDb()
app.listen(port,async() => {
try {
    console.log(`Server running on port ${port} `)
}catch(error) {
    console.log(error)
}
})