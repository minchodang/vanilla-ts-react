import { App } from './App';
import { renderComponent } from './lib/utils/component';

const root = document.getElementById('root')!;
const appElement = renderComponent(App, {});
root.appendChild(appElement);
