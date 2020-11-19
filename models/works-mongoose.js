let Work = require('./works').Work
let AbstractWorksStore = require('./works').AbstractWorksStore
const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) { console.log(err) }
}

let works = [];

exports.MongooseWorksStore = class MongooseWorksStore extends AbstractWorksStore {
    async findAllWorks() {
        await connectDB()
        const works = await Work.find({})
        await mongoose.disconnect()
        return works.map(work => {
            return {
                key: work.key,
                title: work.title,
                type: work.type
            }
        })
    }

    async update(key, title, body, type) {
        await connectDB()
        let work = await Work.findOneAndUpdate({key: key}, {
            title: title,
            body: body,
            type: type
        })
        await mongoose.disconnect()
        return work
    }

    async create(key, title, body, type) {
        await connectDB()
        let count = await Work.countDocuments({})
        let work = new Work({
            key: count,
            title: title,
            body: body,
            type: type
        })
        await work.save()
        await mongoose.disconnect()
        return work
    }

    async read(key) {
        await connectDB()
        const work = await Work.findOne({key: key})
        await mongoose.disconnect()
        return work
    }

    async count() {
        await connectDB()
        const count = await Work.countDocuments({})
        await mongoose.disconnect()
        return count
    }

    async destroy(key) {
        await connectDB()
        await Work.findOneAndDelete({key: key})
        await mongoose.disconnect()
    }
}