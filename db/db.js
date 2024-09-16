import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'

dotenv.config({path: './.env'})
const uri = process.env.DATABASE_URL

const client = new MongoClient(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const connectDb = async() => {
    try {
        await client.connect()
        console.log('Succesfuly connected to MongoDb')
    }catch(error){
        console.log('Error connecting to MongoDB', error)
    }
}

export default connectDb