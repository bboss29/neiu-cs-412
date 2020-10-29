const axios =  require('axios')

exports.getActivity = function () {
    axios.get('https://www.boredapi.com/api/activity')
        .then(function (response) {
            let act = response.data.activity
            console.log(act)
            let child = document.createElement("span")
            child.innerText = act
            let parent = document.querySelector("div")
            parent.appendChild(child)
        })
        .catch(function (error) {
            console.log(error)
        })
}