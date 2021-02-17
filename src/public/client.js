let store = {
  user: { name: 'Friend' },
  value: 0,
};

const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

window.addEventListener('load', () => {
  render(root, store);
});

const App = (state) => {
  return `
  <header class="header">
  <a href="" class="logo">Your Logo</a>
  <input class="menu-btn" type="checkbox" id="menu-btn" />
  <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
  <ul class="menu">
    <li><a class="header-links" id="welcome" onClick={show(store)}>Welcome</a></li>
    <li><a class="header-links" onClick={getRoverInfo(this)}>Curiosity</a></li>
    <li><a class="header-links" onClick={getRoverInfo(this)}>Opportunity</a></li>
    <li><a class="header-links" onClick={getRoverInfo(this)}>Spirit</a></li>
  </ul>
</header>
  <div class="container-main" id="main-section">        
    <div class="container-info" id="show-info">
      <p id="greeting">${greeting(store)}</p>
      ${renderCard(store, getCards)}
    </div>
  </div>
  <div class="container-images" id="images">
    ${renderImages(store, getImages)}
  </div>
  `;
};

const greeting = (store) => {
  return store.roverData
    ? 'Mars Rover Deets'
    : `Hi, ${store.user.name}. Please select a rover to learn more!</p>`;
};

const renderCard = (store, func) => {
  switch (store.value) {
    case 1:
      const { rover, earth_date } = store.roverData;
      const { landing_date, launch_date, name, status } = rover;
      return `
          <card id="card">
            ${func(earth_date, landing_date, launch_date, name, status)}
            <button onClick={getLatestPhotos(store)} id="get-latest">
              GET LATEST PHOTOS
            </button>  
          </card>
        `;
    case 2:
      const { rover: rover2, earth_date: earth_date2 } = store.latest[0];
      const {
        landing_date: landing_date2,
        launch_date: launch_date2,
        name: name2,
        status: status2,
      } = rover2;
      return `
          <card id="card">
            ${func(earth_date2, landing_date2, launch_date2, name2, status2)}
          </card>
        `;
    default:
      return '';
  }
};

const getCards = (earthDate, landingDate, launchDate, name, status) => {
  return `
    <h1 id="name">${name} Rover</h1>
    <h4 id="earth-date">Earth Date: ${earthDate}</h4>
    <h4 id="landing-date">Landing Date: ${landingDate}</h4>
    <h4 id="launch-date">Launch Date: ${launchDate}</h4>
    <h4 id="status">Status: ${status}</h4>
  `;
};

const renderImages = (store, func) => {
  switch (store.value) {
    case 1:
      const { roverImages } = store;
      return `
        <div id="gal" class="gallery">${func(roverImages)}</div>
      `;
    case 2:
      const images = store.latest.splice(0, 5);
      return `
        <div id="gal" class="gallery">${func(images)}</div>
      `;
    default:
      return '';
  }
};

const getImages = (images) => {
  return images
    .map((image, index) => {
      return `
        <div class="image${index}">
          <img class="gallery-images" key="${image.id}" src="${image.img_src}">
        </div>
      `;
    })
    .join(' ');
};

const show = (store) => {
  document.getElementById('main-section').style.visibility = 'hidden';
  document.getElementById('images').style.visibility = 'hidden';
  document.getElementById('greeting').style.visibility = 'visible';
  document.getElementById(
    'greeting'
  ).textContent = `Hi, ${store.user.name}. Please select a rover to learn more!`;
  store.value = 0;
};

const getRoverInfo = async ({ innerHTML }) => {
  const rover = innerHTML.toLowerCase();
  const res = await fetch(`http://localhost:3000/images/${rover}`);
  const data = await res.json();
  updateStore(store, data);
};

const getLatestPhotos = async (store) => {
  const { rover } = store.roverData;
  const { name } = rover;
  const res = await fetch(`http://localhost:3000/latest/${name}`);
  const data = await res.json();
  updateStore(store, data);
};
