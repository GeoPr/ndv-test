import 'regenerator-runtime/runtime';
import { Home } from './components/Home/Home.js';
import { Converter } from './components/Converter/Converter.js';

const root = document.getElementById('root');
const render = html => (root.innerHTML = html);

const pathToRegExp = path => {
  const replacedPath = path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)');
  return new RegExp('^' + replacedPath + '$');
};

const router = async () => {
  root.innerHTML = '<div class="loader"></div>';

  const routes = [
    { path: '/', Component: Home },
    { path: '/converter', Component: Converter },
  ];

  const matches = routes.map(route => ({
    ...route,
    result: location.pathname.match(pathToRegExp(route.path)),
  }));

  let match = matches.find(m => m.result);

  if (!match) {
    match = {
      ...routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.Component(match);
  const html = await view.getHtml();
  render(html);
  view.getCurrentRoot(root);
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

window.addEventListener('popstate', router); // for history navigate

window.addEventListener('load', () => {
  router();

  const links = document.querySelectorAll('[data-type="link"]');

  const clickHandler = e => {
    e.preventDefault();
    navigateTo(e.target.href);
  };
  links.forEach(link => link.addEventListener('click', clickHandler));
});
