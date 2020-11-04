const _work_key = Symbol('key')
const _work_title = Symbol('title')
const _work_body = Symbol('body')
const _work_type = Symbol('type')

exports.Work = class Work {
    constructor(key, title, body, type) {
        this[_work_key] = key
        this[_work_title] = title
        this[_work_body] = body
        this[_work_type] = type
    }

    get key() {return this[_work_key]}
    get title() {return this[_work_title]}
    set title(newTitle) {this[_work_title] = newTitle}
    get body() {return this[_work_body]}
    set body(newBody) {this[_work_body] = newBody}
    get type() {return this[_work_type]}
    set type(newType) {this[_work_type] = newType}

}

exports.AbstractWorksStore = class AbstractWorksStore {
    async close() { }
    async update(key, title, body, type) { }
    async create(key, title, body, type) { }
    async read(key) { }
    async destroy(key) { }
    async keyList() { }
    async count() { }
}