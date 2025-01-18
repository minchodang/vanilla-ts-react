import { App } from './App';
import { renderComponent } from './lib/utils/component';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = document.getElementById('root')!;
const appElement = renderComponent(App, {});
root.appendChild(appElement);
