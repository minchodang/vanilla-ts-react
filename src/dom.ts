import { Fragment, VNode, Props } from '@/lib/jsx/jsx-runtime';
import { renderComponent, updateComponent } from './component';

export const componentInstances = new Map<Function, Map<string, any>>();

export const createElement = (vnode: VNode): HTMLElement | Text | DocumentFragment => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (typeof vnode?.type === 'function') {
    if (vnode.type === Fragment) {
      const fragment = document.createDocumentFragment();
      const children = Array.isArray(vnode.children) ? vnode.children : [vnode.children];

      children.forEach((child) => {
        if (child != null) {
          fragment.appendChild(createElement(child));
        }
      });

      return fragment;
    }

    return renderComponent(vnode.type, vnode.props || {});
  }

  const element = document.createElement(vnode?.type as string);

  if (vnode?.props) {
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value as EventListener);
      } else {
        element.setAttribute(key, String(value));
      }
    });
  }

  if (vnode?.children) {
    const children = Array.isArray(vnode.children) ? vnode.children : [vnode.children];
    children.forEach((child) => {
      if (child != null) {
        element.appendChild(createElement(child));
      }
    });
  }

  return element;
};

export const updateElement = (
  parent: HTMLElement,
  oldVdom: VNode | string | number | null | undefined,
  newVdom: VNode | string | number | null | undefined,
  index: number = 0
) => {
  const existingElement = parent.childNodes[index];

  if (
    typeof oldVdom === 'object' &&
    typeof newVdom === 'object' &&
    oldVdom?.type === newVdom?.type &&
    typeof newVdom?.type === 'function'
  ) {
    const instanceMap = componentInstances.get(newVdom.type);
    const instanceKey = (newVdom.props?.key as string) || 'default';
    const instance = instanceMap?.get(instanceKey);

    if (instance && existingElement === instance.element) {
      updateComponent(instance, newVdom.props ?? {});
      return;
    }
  }

  // Handle node addition
  if (oldVdom == null) {
    if (newVdom != null) {
      const newElement = createElement(newVdom);
      parent.appendChild(newElement);
    }
    return;
  }

  // Handle node removal
  if (newVdom == null) {
    parent.removeChild(existingElement);
    return;
  }

  // Handle text node updates
  if (
    (typeof oldVdom === 'string' || typeof oldVdom === 'number') &&
    (typeof newVdom === 'string' || typeof newVdom === 'number')
  ) {
    if (oldVdom.toString() !== newVdom.toString()) {
      const newTextNode = document.createTextNode(newVdom.toString());
      parent.replaceChild(newTextNode, existingElement);
    }
    return;
  }

  // Handle different node types
  if (typeof oldVdom !== typeof newVdom) {
    const newElement = createElement(newVdom);
    parent.replaceChild(newElement, existingElement);
    return;
  }

  // Handle VNode updates
  if (typeof oldVdom === 'object' && typeof newVdom === 'object') {
    // Different component or element types
    if (oldVdom.type !== newVdom.type) {
      const newElement = createElement(newVdom);
      parent.replaceChild(newElement, existingElement);
      return;
    }

    // Same type of element, update props and children
    if (typeof newVdom.type === 'string') {
      const element = existingElement as HTMLElement;

      // Update props
      updateProps(element, oldVdom.props || {}, newVdom.props || {});

      // Normalize children arrays
      const oldChildren = Array.isArray(oldVdom.children) ? oldVdom.children : [oldVdom.children];
      const newChildren = Array.isArray(newVdom.children) ? newVdom.children : [newVdom.children];

      // Update all children
      const maxLength = Math.max(oldChildren.length, newChildren.length);
      for (let i = 0; i < maxLength; i++) {
        updateElement(element, oldChildren[i], newChildren[i], i);
      }
    }
  }
};

const updateProps = (element: HTMLElement, oldProps: Props<unknown>, newProps: Props<unknown>) => {
  // Remove old props
  for (const [key, value] of Object.entries(oldProps)) {
    if (!(key in newProps)) {
      if (key.startsWith('on') && typeof value === 'function') {
        element.removeEventListener(key.substring(2).toLowerCase(), value as EventListener);
      } else {
        element.removeAttribute(key);
      }
    }
  }

  // Add or update new props
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] !== value) {
      if (key.startsWith('on') && typeof value === 'function') {
        if (typeof oldProps[key] === 'function') {
          element.removeEventListener(
            key.substring(2).toLowerCase(),
            oldProps[key] as EventListener
          );
        }
        element.addEventListener(key.substring(2).toLowerCase(), value as EventListener);
      } else {
        if (value === null || value === false) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, String(value));
        }
      }
    }
  }
};

export const shallowEqual = <T extends Record<string, unknown>>(
  obj1: T | null,
  obj2: T | null
): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => obj1[key] === obj2[key]);
};
