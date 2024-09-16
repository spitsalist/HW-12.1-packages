import {Router} from 'express'
import {MongoClient} from 'mongodb'

export const router = Router()

const uri = process.env.DATABASE_URL
const client = new MongoClient(uri)

const getPackagesCollection = async () => {
    await client.connect()
    const database = client.db('testdb')
    return database.collection('packages')
}

router.get('/packages', async(req, res) => {
    try{
        const packages = await getPackagesCollection()
        const allPackages = await packages.find().toArray()
        res.status(200).json(allPackages)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/packages/:name', async(req, res) => {
     const {name} = req.params
     try{
        const packages = await getPackagesCollection()
        const pkg = await packages.findOne({name})
        if(!pkg) {
            return res.status(404).json({message: 'Package not found'})
        }
        res.status(200).json(pkg)
     }catch(error){
        res.status(500).json({message:'Internal server error'})
     }
})

router.post('/packages', async(req, res) => {
    const newPackages = req.body
    try {
        const packages = await getPackagesCollection()
        await  packages.insertOne(newPackages)
        res.status(201).json(newPackages)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.delete('/packages/:name', async(req, res) => {
    const {name} = req.params
    try {
        const packages = await getPackagesCollection()
        const deletePackage = await packages.deleteOne({name})
        if(deletePackage.deletedCount === 0) {
            return res.status(404).json({message: 'Package not found'})
        }
        res.status(200).json({message: 'Package deleted'})
    }catch(error) {
        res.status(500).json({message: 'Internal server error'})
    }
})

router.put('/packages/:name', async(req, res)=>{
    const {name} = req.params
    const {dependencies} = req.body
    try{
        const packages = await getPackagesCollection()
        const updatePackage = await packages.findOneAndUpdate(
            {name},
        {$set: {dependencies: Object.fromEntries(
            Object.entries(dependencies).map(([key, value]) => [key, value])
        )}
    })
if(!updatePackage) {
    return res.status(404).json({message: 'Package not found'})
}
res.status(200).json(updatePackage)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.patch('/packages/:name', async(req, res) => {
    const {name} = req.params
    try {
        const packages = await getPackagesCollection()
        const pkg = await packages.findOne({name})
        if(!pkg) {
            return res.status(404).json({message: 'Package not found'})
    }
    const [major, minor, patch] = pkg.version.split('.').map(Number)
    const newVersion = `${major}.${minor}.${patch +1}`
    const updatePackage = await packages.findOneAndUpdate(
        {name},
        {$set:{version: newVersion}
    })
        res.status(200).json(updatePackage)
        }catch(error){
            res.status(500).json({message: 'Internal server error'})
            }
})