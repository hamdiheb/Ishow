let displayMax = 24

async function fetchShows() {
  const query = await fetch('https://api.tvmaze.com/shows?page=1')
  const respond = await query.json()
  return respond
}

function createShowComponent(show) {
  const showArticle = document.createElement('article')

  const showTitle = document.createElement('h3')
  showTitle.textContent = show.name
  const showImg = document.createElement('img')
  showImg.src = show.image.medium
  showImg.classList.add('show_img')
  const showDate = document.createElement('p')
  showDate.textContent = show.premiered
  const showDescription = document.createElement('p')
  showDescription.innerHTML = show.summary

  const showData = document.createElement('div')
  showData.append(showTitle, showDate, showDescription)
  showData.classList.add('show_component_data')
  showArticle.append(showImg, showData)
  showArticle.classList.add('show_component')
  return showArticle
}

async function displayShows(displayMax) {
  const showsArray = await fetchShows()
  if (displayMax < showsArray.length) {
    const showsDisplay = document.querySelector('#main_show_display')
    showsDisplay.innerHTML = ``
    for (let i = 0; i < displayMax; i++) {
      const showComponent = createShowComponent(showsArray[i])
      showsDisplay.appendChild(showComponent)
    }
  } else {
    alert('No more shows to render')
  }
}

function loadShow(displayMax) {
  const loadBtn = document.querySelector('#load_btn')
  loadBtn.addEventListener('click', () => {
    displayMax = displayMax + 24
    displayShows(displayMax)
  })
}

function init(displayMax) {
  displayShows(displayMax)
  loadShow(displayMax)
}

init(displayMax)
