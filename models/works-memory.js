let Work = require('./works').Work
let AbstractWorksStore = require('./works').AbstractWorksStore

let works = [];

exports.InMemoryWorksStore = class InMemoryWorksStore extends AbstractWorksStore {
    async close() { }

    async update(key, title, body, type) {
        works[key].title = title
        works[key].body = body
        works[key].type = type
        return works[key]
    }

    async create(key, title, body, type) {
        works[key] = new Work(key, title, body, type)
        return works[key]
    }

    async read(key) {
        if (works[key])
            return works[key]
        else
            return new Error(`Work ${key} does not exist`)
    }

    async destroy(key){
        if (works[key])
            delete works[key]
        else
            return new Error(`Work ${key} does not exist`)
    }

    async keyList() {
        return Object.keys(works)
    }

    async count() {
        return works.length
    }
}