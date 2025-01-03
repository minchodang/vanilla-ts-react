import type { Component } from '@/lib/jsx/jsx-runtime';
import { render } from '../dom/render';

export type Route = {
  path: string;
  element?: Component;
  errorElement?: Component;
  children?: Route[];
};

export const pathToRegex = (path: string) => {
  return new RegExp('^' + path.replace(/:\w+/g, '(.+)') + '$');
};

const spaRouter = () => {
  let pageParams: any;
  const routeInfo: { root: HTMLElement | null; routes: Route[] | null } = {
    root: null,
    routes: null,
  };

  const matchUrlToRoute = (routes: Route[], path: string) => {
    const segments = path.split('/').map((segment) => {
      if (segment === '') return '/';
      return segment;
    });
    if (segments.length <= 2 && segments[1] === '/') {
      return { Component: routes[0].element, params: undefined };
    }
    function traverse(routes: Route[], segments: string[], errorComponent?: Component) {
      for (const route of routes) {
        const { path, children, element, errorElement } = route;
        const regex = pathToRegex(path);
        const [pathname, params] = segments[0].match(regex) || [];
        if (!pathname) continue;
        if (segments.length === 1) {
          return { Component: element, params: params };
        } else if (children) {
          return traverse(children, segments.slice(1), errorElement ?? errorComponent);
        }
      }
      return { Component: errorComponent, params: undefined };
    }
    return traverse(routes, segments);
  };

  const loadRouteComponent = (path: string) => {
    const { Component, params } = matchUrlToRoute(routeInfo.routes ?? [], path);
    if (!Component) {
      throw new Error('no matching component error');
    } else {
      pageParams = params;
      if (routeInfo.root) {
        render(routeInfo.root, Component);
      } else {
        throw new Error('root element is empty');
      }
    }
  };

  const history = {
    getPageParams() {
      return pageParams;
    },
    replace(path: string) {
      const { pathname, search } = new URL(window.location.origin + path);
      window.history.replaceState({}, '', pathname + search);
      loadRouteComponent(pathname);
    },
    push(path: string) {
      const { pathname, search } = new URL(window.location.origin + path);
      window.history.pushState({}, '', pathname + search);
      loadRouteComponent(pathname);
    },
    back() {
      window.history.back();
    },
    currentPath() {
      return window.location.pathname;
    },
  };

  const router = (root: HTMLElement, routes: Route[]) => {
    routeInfo.root = root;
    routeInfo.routes = routes;

    const customizeAnchorBehavior = () => {
      window.addEventListener('click', (e) => {
        const el = e.target as HTMLElement;
        const anchor = el.closest('a[href]');
        if (!(anchor instanceof HTMLAnchorElement)) return;
        if (!anchor) return;
        e.preventDefault();
        history.push(anchor.pathname + anchor.search);
      });
    };
    const initLoad = () => {
      loadRouteComponent(history.currentPath());
      customizeAnchorBehavior();

      window.addEventListener('popstate', () => {
        loadRouteComponent(history.currentPath());
      });
    };

    initLoad();
  };

  return { history, router };
};

export const { history, router } = spaRouter();
