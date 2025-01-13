import { App } from './App';
import { renderComponent } from './component';

const root = document.getElementById('root')!;
renderComponent(App, {}, root);
