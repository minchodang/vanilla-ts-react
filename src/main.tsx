import App from './App';
import { createElement } from './lib/dom/client';

const app = document.getElementById('app') as HTMLElement;

app.appendChild(createElement(<App />));
