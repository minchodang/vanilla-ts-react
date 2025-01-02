import { router } from './lib/router/router';
import { routes } from './routes/routes';

const app = document.getElementById('app') as HTMLElement;

router(app, routes);
