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
      </div>
    </div>
    <div class="container-images" id="images">
      <div class="gallery">${showImages()}</div>
    </div>
    <footer></footer>
    `;
};

window.addEventListener('load', () => {
  render(root, store);
});

const getRoverInfo = async ({ innerHTML }) => {
  const rover = innerHTML.toLowerCase();
  const res = await fetch(`http://localhost:3000/${rover}`);
  const data = await res.json();
  updateStore(store, data);
  showRover();
};

const showRover = () => {
  const { rover, earth_date } = store.roverData;
  const { landing_date, launch_date, name, status } = rover;

  const show = document.getElementById('show-info');
  document.getElementById('main-section').style.visibility = 'visible';
  document.getElementById('greeting').innerHTML = 'Rover Information';

  let card = document.createElement('card');

  let roverName = document.createElement('h1');
  roverName.textContent = `${name}`;
  card.appendChild(roverName);

  let earthDate = document.createElement('h4');
  earthDate.textContent = `Earth Date: ${earth_date}`;
  card.appendChild(earthDate);

  let landingDate = document.createElement('h4');
  landingDate.textContent = `Landing Date: ${landing_date}`;
  card.appendChild(landingDate);

  let launchDate = document.createElement('h4');
  launchDate.textContent = `Launch Date: ${launch_date}`;
  card.appendChild(launchDate);

  let roverStatus = document.createElement('h4');
  roverStatus.textContent = `Status: ${status}`;
  card.appendChild(roverStatus);

  show.appendChild(card);
};

const showImages = () => {
  if (!store.roverImages) {
    return '';
  } else {
    const { roverImages } = store;
    return roverImages
      .map((roverImage, index) => {
        return `<div class="image${index}" ><img class="gallery-images" key=${roverImage.id} src=${roverImage.img_src}></div>`;
      })
      .join(' ');
  }
};

const show = () => {
  document.getElementById('main-section').style.visibility = 'hidden';
  document.getElementById('images').style.visibility = 'hidden';
  document.getElementById('greeting').style.visibility = 'visible';
  document.getElementById('greeting').textContent =   `Hi, ${store.user.name}. Please select a rover to learn more!`;
};
