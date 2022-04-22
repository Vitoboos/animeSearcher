const HTMLResponse = document.querySelector('#app')
const animeHTML = document.createElement('ul');
animeHTML.classList.add("searchList")

const animeInput = document.querySelector('#animeName')
var animeToSearch = null
const fetchBtn = document.querySelector('#searchAnime')

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'jikan1.p.rapidapi.com',
		'X-RapidAPI-Key': '913b8fd30amshc4ad37404a6ea74p1e7223jsnf22e09472a44'
	}
};

function nameInputValue(){

    if(searchFor === "" || searchFor === null){
        return
    }

    var searchFor = animeInput.value
    searchFor = searchFor.replace(' ', '%20')
    animeToSearch = searchFor

    console.log(animeToSearch)

    handleSearch()

}

fetchBtn.onclick = nameInputValue

function handleSearch(){

    fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${animeToSearch}`, options)
        .then(response => response.json())
        .then((data) => {

        // Delete Previous Renders //

        while (animeHTML.hasChildNodes()){

            animeHTML.removeChild(animeHTML.lastChild)

        }

        // Set data searched for //

        const animeList = data.results

        // If found results, call function to render data //


        if (animeList != null){

            renderData(animeList, HTMLResponse, animeHTML)

        }

        // If not found any result, call function to render error 404 //

        if (animeHTML.hasChildNodes() === false){

            notFound(HTMLResponse, animeHTML)

        }

        })

}

function searchTag(index){

    fetch(`https://jikan1.p.rapidapi.com/genre/anime/${index}/1`, options)
	.then(response => response.json())
    .then((data) =>{

        const genreList = data.anime

        while (animeHTML.hasChildNodes()){

            animeHTML.removeChild(animeHTML.lastChild)

        }

        if (genreList != null){

            let genreTitle = document.createElement('h1')
            genreTitle.classList.add('genreTitle')
            genreTitle.innerText = (`${data.mal_url.name}`)

            animeHTML.appendChild(genreTitle)
            HTMLResponse.appendChild(animeHTML)

            renderData(genreList, HTMLResponse, animeHTML)
        }

    })

}

const tagBtns = document.getElementsByClassName("tag")
const demoBtns = document.getElementsByClassName("demographic")

function getTag(e){

    const item = e.target
    const index = item.id
    const newIndex = index.replace("tag", "")

    searchTag(newIndex)

}

for (let item of tagBtns){

    item.addEventListener("click", getTag)

}

for (let item of demoBtns){

    item.addEventListener("click", getTag)

}

// Watch List //

const exportListBtn = document.getElementById('exportBtn')
const deleteItemBtn = document.getElementById('clearBtn')

// Append anime to Watch LIST //

function fetchAnime(e){

    var anime = e.target
    var anime_url = anime.getElementsByClassName('link')
    anime_url = anime_url[0].href

    const animeList = document.getElementById('toWatch')

    const listItem = document.createElement('li')
    listItem.classList.add("item")
    listItem.innerText = anime.innerText

    const delBtn = document.createElement('input')
    delBtn.classList.add("checkbox")
    delBtn.type = "checkbox"

    listItem.append(delBtn)
    animeList.append(listItem)

    console.log(animeList)

    return

}

// Export watch LIST to  computer //

function exportList(){

    const animeList = document.getElementById('toWatch')

    const animes = animeList.getElementsByClassName("item")

    let data = ['Anime Name \n']

    for (var i = 0; i < animes.length; i++){

        console.log(animes[i].innerText)

        data.push(animes[i].innerText + '\n')

    }

    const blob = new Blob([data], {type:"octet-stream"})
    const href = URL.createObjectURL(blob)

    const link = Object.assign(document.createElement('a'), {
        href, 
        style:"display:none",
        download:"myData.txt"
    })

    document.body.appendChild(link)

    link.click()
    URL.revokeObjectURL(href)
    link.remove()

    return

}

// Delete watch LIST items //

function clearItems(){  

    const toWatch = document.getElementById('toWatch')    
    var checkbox = toWatch.getElementsByClassName("checkbox")
    var toDelete = []

    // Selecting items to delete //

    for (var i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true ){
            toDelete.push(checkbox[i].parentElement)
        }
    }

    // Deleting items //

    for (var i = 0; i < toDelete.length; i++){
        toDelete[i].remove()
    }

    return

}

exportListBtn.onclick = exportList
deleteItemBtn.onclick = clearItems

// Rendering Data in Page //

function renderData(toPrintList, placement, searchList){

    // Check if renderData is called by a tag or demographic

    const checkGenre = document.getElementsByClassName('genreTitle')

    if (checkGenre[0] == null){

        // Render animes in page

        toPrintList.forEach(anime => {

        if(anime.rated != "Rx"){

            // Set values to HTMl elements

            let itemBox = document.createElement('div')
            itemBox.classList.add('item')
            itemBox.addEventListener("click", fetchAnime)

            let toAdd = document.createElement('li')
            toAdd.classList.add('title')

            let toAddUrl = document.createElement('a')
            toAddUrl.classList.add("link")
            toAddUrl.innerText = (`${anime.title}`) 
            toAddUrl.href = (`${anime.url}`)

            let toAddImg = document.createElement('img')
            toAddImg.classList.add('image')

            toAddImg.src =`${anime.image_url}`

            // Render data

            toAdd.appendChild(toAddUrl)
            itemBox.appendChild(toAdd)
            itemBox.appendChild(toAddImg)
            searchList.appendChild(itemBox)  

        }

    placement.appendChild(animeHTML)

    return

    })

    }

    // Order array of animes alphabetically

    let orderList = []

    toPrintList.forEach(anime => {

        orderList.push([anime.title, anime.image_url, anime.rated, anime.url])

    })

    orderList = orderList.sort()

            // Render animes in page

    orderList.forEach(anime =>{

        if(anime[2] != "Rx"){

            // Set values to HTMl elements

            let itemBox = document.createElement('div')
            itemBox.classList.add('item')
            itemBox.addEventListener("click", fetchAnime)

            let toAdd = document.createElement('li')
            toAdd.classList.add('title')

            let toAddUrl = document.createElement('a')
            toAddUrl.classList.add("link")
            toAddUrl.innerText = (`${anime[0]}`) 
            toAddUrl.href = (`${anime[3]}`)

            let toAddImg = document.createElement('img')
            toAddImg.classList.add('image')

            toAddImg.src =`${anime[1]}`

            // Render data

            toAdd.appendChild(toAddUrl)
            itemBox.appendChild(toAdd)
            itemBox.appendChild(toAddImg)
            searchList.appendChild(itemBox)  

        }

    placement.appendChild(animeHTML)

    return

    })

}

function notFound(placement, searchList){

    let disclaimer = document.createElement('li')
    disclaimer.append(document.createTextNode("0 Results Found :c"))
    disclaimer.classList.add('noResults')

    searchList.appendChild(disclaimer)

    placement.appendChild(searchList)

    return

}