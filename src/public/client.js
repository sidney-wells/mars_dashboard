let store = {
  user: { name: 'Friend' },
};

const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const App = (state) => {
  let { rovers, apod } = state;

  return `
    <header>
      <div>
        <h2 class="header-links" onClick={getRoverInfo(this)}>Curiosity</h2>
        <h2 class="header-links" onClick={getRoverInfo(this)}>Opportunity</h2>
        <h2 class="header-links" onClick={getRoverInfo(this)}>Spirit</h2>
        <h2 class="header-links" id="welcome" onClick={show()} >Welcome</h2>
      </div>
    </header>
    <div class="container-main" id="main-section">        
      <div class="container-info" id="show-info">
        <p id="greeting">Hi, ${store.user.name}. Please select a rover to learn more!</p>
        <card id="card" style="visibility:hidden;">
          <h1 id="name"></h1>
          <h4 id="earth-date"></h4>
          <h4 id="landing-date"></h4>
          <h4 id="launch-date"></h4>
          <h4 id="status"></h4>
          <button id="get-latest"></button>
        </card>
      </div>
    </div>
    <div class="container-images" id="images">
      <div id="gal" class="gallery"></div>
    </div>
    <footer></footer>
    `;
};

window.addEventListener('load', () => {
  render(root, store);
});

const getRoverInfo = async ({ innerHTML }) => {
  const value = 'info';
  const rover = innerHTML.toLowerCase();
  const res = await fetch(`http://localhost:3000/images/${rover}`);
  const data = await res.json();
  updateStore(store, data);
  showRover(value);
  showImages(value);
};

const showRover = (value) => {
  const { rover, earth_date } = value ? store.roverData : store.latest[0];
  const { landing_date, launch_date, name, status } = rover;

  document.getElementById('main-section').style.visibility = 'visible';
  document.getElementById('card').style.visibility = 'visible';
  document.getElementById('greeting').innerHTML = value
    ? 'Mars Rover Information'
    : 'Mars Rover Latest Photos';

  let roverName = document.getElementById('name');
  roverName.textContent = `${name} Rover`;
  card.appendChild(roverName);

  let earthDate = document.getElementById('earth-date');
  earthDate.textContent = `Earth Date: ${earth_date}`;
  card.appendChild(earthDate);

  let landingDate = document.getElementById('landing-date');
  landingDate.textContent = `Landing Date: ${landing_date}`;
  card.appendChild(landingDate);

  let launchDate = document.getElementById('launch-date');
  launchDate.textContent = `Launch Date: ${launch_date}`;
  card.appendChild(launchDate);

  let roverStatus = document.getElementById('status');
  roverStatus.textContent = `Status: ${status}`;
  card.appendChild(roverStatus);

  if (value) {
    let getLatest = document.getElementById('get-latest');
    getLatest.textContent = 'Get Latest Photos';
    getLatest.onclick = function () {
      getLatestPhotos(`${name}`.toLowerCase());
    };
  } else {
    document.getElementById('get-latest').remove();
  }
};

const getLatestPhotos = async (rover) => {
  const res = await fetch(`http://localhost:3000/latest/${rover}`);
  const data = await res.json();
  updateStore(store, data);
  showRover();
  showImages();
};

const showImages = (value) => {
  if (value) {
    const { roverImages } = store;
    const imageSection = document.getElementById('gal');
    roverImages
      .map((roverImage, index) => {
        let imageDiv = document.createElement('div');
        imageDiv.className = `image${index}`;
        let image = document.createElement('img');
        image.className = 'gallery-images';
        image.key = `${roverImage.id}`;
        image.src = `${roverImage.img_src}`;
        imageDiv.appendChild(image);
        imageSection.appendChild(imageDiv);
      })
      .join(' ');
  } else {
    const imageSection = document.getElementById('gal');
    const images = store.latest.splice(0, 5);
    images.map((photo, index) => {
      let imageDiv = document.createElement('div');
      imageDiv.className = `image${index}`;
      let image = document.createElement('img');
      image.className = 'gallery-images';
      image.key = `${photo.id}`;
      image.src = `${photo.img_src}`;
      imageDiv.appendChild(image);
      imageSection.appendChild(imageDiv);
    });
  }
};

const show = () => {
  document.getElementById('main-section').style.visibility = 'hidden';
  document.getElementById('images').style.visibility = 'hidden';
  document.getElementById('greeting').style.visibility = 'visible';
  document.getElementById(
    'greeting'
  ).textContent = `Hi, ${store.user.name}. Please select a rover to learn more!`;
};
