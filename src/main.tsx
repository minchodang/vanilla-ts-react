import { App } from './App';
import { renderComponent } from './component';

const root = document.getElementById('root')!;
const appElement = renderComponent(App, {});
root.appendChild(appElement);
