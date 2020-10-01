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
    addWorksToLink(linkID: Int, workIDs: [Int]): Link
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
    "works": [
        {
            id: 0,
            name: 'show'
        },
        {
            id: 1,
            name: 'new show'
        }
    ],
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

    addWorksToLink: ({linkID, workIDs}) => {
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
    graphql(schema, `mutation { createLink(desc: ${desc}, workIDs: ${wIDs}) {id} }`, resolvers).then()
}

// add a work to a link
function linkUp(lID, wIDs) {
    graphql(schema, `mutation { addWorksToLink(linkID: ${lID}, workIDs: ${wIDs}) {id} }`, resolvers).then()
}

// show links
function showLinks() {
    graphql(schema, `{ links { id desc works { name } } }`, resolvers).then((response) => {
        console.log(response.data.links)
    })
}

// show works
function showWorks() {
    graphql(schema, `{ works { name } }`, resolvers).then((response) => {
        console.log(response.data.works)
    })
}