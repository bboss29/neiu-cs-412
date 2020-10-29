const { graphql, buildSchema } = require('graphql')

const schema = buildSchema(`
type Query {
    hello: String!
    works: [Work]
    links: [Link]
}

type Mutation {
    createWork(name: String): Work
    createLink(desc: String, workIDs: [Int]): Work
    linkUp(linkID: Int, workIDs: [Int]): Link
}

type Work {
    id : Int!
    name : String!
}

input WorkInput {
    id : Int!
    name : String!
}

type Link {
    id : Int!
    desc: String
    works: [Work]
}
`)

let db = {
    "works": [],
    "links" : []
}

const resolvers = {
    hello: () => 'Hello world!',
    works: () => { return db["works"] },
    links: () => { return db["links"] },

    createWork: ({name}) => {
        const work = {
            id: db["works"].length,
            name: name,
        }
        db["works"].push(work)
        return work
    },

    createLink: ({desc, workIDs}) => {
        let temp_works = []
        for (let w = 0; w < workIDs.length; w++) {
            temp_works.push(db["works"][workIDs[w]])
        }
        const link = {
            id: db["links"].length,
            desc: desc,
            works: temp_works,
        }
        db["links"].push(link)
        return link
    },

    linkUp: ({linkID, workIDs}) => {
        for (let w = 0; w < workIDs.length; w++) {
            db["links"][linkID].works.push(db["works"][workIDs[w]])
        }
        return db["links"][linkID]
    }
}

// create a work
function createWork(name) {
    graphql(schema, `mutation { createWork(name: "${name}") {id} }`, resolvers).then()
}

// create a link
function createLink(desc, wIDs) {
    graphql(schema, `mutation { createLink(desc: "${desc}", workIDs: [${wIDs}]) {id} }`, resolvers).then((response) => {
        // console.log(response)
    })
}

// add a work to a link
function linkUp(lID, wIDs) {
    graphql(schema, `mutation { linkUp(linkID: ${lID}, workIDs: [${wIDs}]) {id} }`, resolvers).then((response) => {
        // console.log(response)
    })
}

// show links
function showLinks() {
    graphql(schema, `{ links { id desc works { name } } }`, resolvers).then((response) => {
        console.log("All Links: ")
        let l = response.data.links
        for (let i = 0; i < l.length; i++) {
            console.log(`\tLink ${l[i].id}: ${l[i].desc}`)
            for (let w = 0; w < l[i].works.length; w++) {
                console.log("\t\t" + l[i].works[w].name)
            }
        }
    })
}

// show works
function showWorks() {
    graphql(schema, `{ works { id name } }`, resolvers).then((response) => {
        let w = response.data.works
        // let html = "<h1> All Works </h1><ul>"
        console.log("All Works: ")
        for (let i = 0; i < w.length; i++) {
            // html += "<li>${w[i][\"name\"]}</li>"
            console.log("\t" + w[i]["name"])
        }
        console.log()
        // return html + "</ul>"
    })
}

module.exports = {
    createWork : createWork,
    showWorks : showWorks,
    showLinks : showLinks,
    createLink : createLink,
    linkUp : linkUp,
}