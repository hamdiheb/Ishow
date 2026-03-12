let displayMax = 24

async function fetchShows() {
  const query = await fetch('https://api.tvmaze.com/shows?page=1')
  const respond = await query.json()
  return respond
}

function createShowComponent(show) {
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
  showArticle.classList.add('show_component')
  return showArticle
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

async function init(displayMax) {
  const showsArray = await fetchShows()
  displayShows(displayMax, showsArray)
  loadShow(displayMax, showsArray)
  filterShow(showsArray)
}

init(displayMax)
