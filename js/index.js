// form handler
let form = document.getElementById('github-form')
let input = document.getElementById('search')
let results = []
form.addEventListener('submit', e => {
    e.preventDefault()
    removeAllChildNodes(userList)
    removeAllChildNodes(repoList)
    fetchUSE(input.value)
    input.value = ""
})

// fetch User Search Endpoint
async function fetchUSE(user) {
    const res = await fetch(`https://api.github.com/search/users?q=${user}`, {
        method: "GET",
        headers : {
            "Accept": "application/vnd.github.v3+json"
        }
    })
    const json = await res.json()
    json.items.forEach(result => {
        buildUser(result)
})
}

// build returned users
let userList = document.getElementById('user-list')
function buildUser(obj) {
    let userDiv = document.createElement('div')
    userDiv.className = "returned-user"
    userDiv.style.padding = "10px"

    let userLogin = document.createElement("h2")
    userLogin.textContent = obj.login

    let GHLink = document.createElement('h3')

    let userLink = document.createElement('a')

    userLink.href = obj.html_url
    userLink.textContent = `Visit ${obj.login}'s GitHub`

    let repoLink = document.createElement('h3')
    repoLink.className = "URE"
    repoLink.textContent = `Click to see ${obj.login}'s public repositories`
    repoLink.style.fontFamily = "Comic Sans MS"
    repoLink.style.backgroundImage = "linear-gradient(to right, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787)"
    repoLink.style.color = "transparent"
    repoLink.style.backgroundClip = "text"
    repoLink.style.webkitBackgroundClip = "text"

    let userAvatar = document.createElement('img')
    userAvatar.src = obj.avatar_url

    let br = document.createElement('br')
    userList.appendChild(userDiv)
    userDiv.appendChild(userLogin)
    userDiv.appendChild(GHLink)
    GHLink.appendChild(userLink)
    userDiv.appendChild(repoLink)
    userDiv.appendChild(userAvatar)
    userDiv.style.border = "thick solid black"
    userDiv.after(br)
    results.push(userDiv)

    // handle finding user repos
    repoLink.addEventListener('click', e => {
        let repoHeader = document.createElement('h2')
        repoHeader.textContent = `${obj.login}'s public repos`
        repoList.appendChild(repoHeader)
        fetchURE(obj.login)
        console.log(e.target.parentNode)
        results.forEach(div => div.style.display = "none")
        e.target.parentNode.style.display = "block"
        repoLink.remove()
    })
}

// clear returned results
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// fetch User Repos Endpoint
async function fetchURE(user) {
    const res = await fetch(`https://api.github.com/users/${user}/repos`, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json"
        }
    })
    const json = await res.json()
    json.forEach(result => buildRepos(result))
}

// build returned repos
let repoList = document.getElementById("repos-list")
function buildRepos(data) {
    let repoLi = document.createElement('li')
    let repoA = document.createElement('a')
    repoA.href = data.html_url
    repoA.textContent = data.name
    repoList.appendChild(repoLi)
    repoLi.appendChild(repoA)
}