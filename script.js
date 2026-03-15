let displayMax = 24

async function fetchShows() {
  const query = await fetch('https://api.tvmaze.com/shows?page=1')
  const respond = await query.json()
  return respond
}

function createShowComponent(show) {
  const forwardShow = document.createElement('a')
  const showArticle = document.createElement('article')

  const showImg = document.createElement('img')
  showImg.src = show.image.medium
  showImg.classList.add('show_img')
  const showRate = document.createElement('p')
  showRate.textContent = show.rating.average
  showRate.classList.add('show_rating')

  const showVisual = document.createElement('div')
  showVisual.classList.add('show_visual')
  showVisual.append(showImg, showRate)
  const showTitle = document.createElement('h3')
  showTitle.textContent = show.name

  const showDate = document.createElement('p')
  showDate.textContent = show.premiered

  const showDescription = document.createElement('p')
  showDescription.innerHTML = show.summary

  const showData = document.createElement('div')
  showData.classList.add('show_component_data')
  showData.append(showTitle, showDate, showDescription)

  showArticle.append(showVisual, showData)
  forwardShow.classList.add('show_component')
  forwardShow.href = `${window.location.origin}/?id=${show.id}`
  forwardShow.append(showArticle)
  return forwardShow
}

function resetNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

async function displayShows(displayMax, showsArray) {
  const showsDisplay = document.querySelector('#main_show_display')
  resetNode(showsDisplay)
  for (let i = 0; i < displayMax; i++) {
    const showComponent = createShowComponent(showsArray[i])
    showsDisplay.appendChild(showComponent)
  }
}

function loadShow(displayMax, showsArray) {
  const loadBtn = document.querySelector('#load_btn')
  loadBtn.addEventListener('click', () => {
    displayMax = displayMax + 24
    displayShows(displayMax, showsArray)
  })
}

function filterShow(showsArray) {
  const inputSearch = document.querySelector('#main_input_search')
  inputSearch.addEventListener('keyup', (event) => {
    const filteredShows = showsArray.filter((show) => {
      if (show.name.toUpperCase().includes(inputSearch.value.toUpperCase())) {
        return show
      }
    })
    displayShows(filteredShows.length, filteredShows)
    if (inputSearch.value.length === 0) {
      displayShows(displayMax, showsArray)
    }
  })
}

function sortRating(showsArray) {
  const sortedShowsRating = showsArray.sort(
    (showA, showB) => showA.rating.average - showB.rating.average,
  )

  const sortBtn = document.querySelector('#sort_rate_btn')
  sortBtn.addEventListener('click', async () => {
    if (sortBtn.className == 'sort__btn') {
      sortBtn.setAttribute('class', 'active_sort_btn')
      displayShows(displayMax, sortedShowsRating)
    } else {
      sortBtn.setAttribute('class', 'sort__btn')
      const shows = await fetchShows()
      displayShows(displayMax, shows)
    }
  })
}

async function renderEp(main, showID) {
  const req = await fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
  const res = await req.json()
  console.log(res)
}

function createShowData(show) {
  const main = document.querySelector('main')

  const showTemplate = document.querySelector('template')
  const showClone = showTemplate.content.cloneNode(true)

  const showImg = showClone.querySelector('img')
  const showTitle = showClone.querySelector('.show_title_data')
  const showRelease = showClone.querySelector('#show_release')
  const showRating = showClone.querySelector('#show_data_rated')
  const showType = showClone.querySelector('#show_type')
  const showDescription = showClone.querySelector('#show_details_description')
  let type = ''
  show[0].genres.forEach((genre) => {
    type = type + ` ` + genre
  })

  showImg.src = show[0].image.medium
  showTitle.textContent = show[0].name
  showRelease.textContent = show[0].premiered
  showRating.textContent = show[0].rating.average
  showType.textContent = type
  showDescription.innerHTML = show[0].summary
  main.append(showClone)
  renderEp(main, show[0].id)
}

function renderShow(showsArray) {
  const query = new URLSearchParams(window.location.search)
  const showID = query.get('id')
  const show = showsArray.filter((show) => show.id == showID)
  if (showID) {
    const main = document.querySelector('main')
    resetNode(main)
    createShowData(show)
  }
}

async function init(displayMax) {
  const showsArray = await fetchShows()
  displayShows(displayMax, showsArray)
  loadShow(displayMax, showsArray)
  filterShow(showsArray)
  sortRating(showsArray)
  renderShow(showsArray)
}

init(displayMax)
