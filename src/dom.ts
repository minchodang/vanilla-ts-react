import { VNode, Fragment, VDOM } from '@/lib/jsx/jsx-runtime';
import { renderComponent } from './component';

export const createElement = (
  vnode: VNode | string | number
): HTMLElement | Text | DocumentFragment => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (typeof vnode?.type === 'function') {
    // Fragment handling
    if (vnode.type === Fragment) {
      const children = vnode.children;
      const fragment = document.createDocumentFragment();

      if (Array.isArray(children)) {
        children.forEach((child) => {
          fragment.appendChild(createElement(child));
        });
      } else if (children != null) {
        fragment.appendChild(createElement(children));
      }

      return fragment;
    } else {
      // Component handling without additional div container
      const componentContainer = document.createElement('div');
      componentContainer.setAttribute('data-component', vnode.type.name || 'anonymous');
      renderComponent(vnode.type, vnode.props, componentContainer); // 컨테이너를 전달하여 인스턴스 재사용
      return componentContainer;
    }
  }

  // Regular HTML element handling
  const element = document.createElement(vnode?.type as string);

  if (vnode?.props) {
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value as EventListener);
      } else {
        element.setAttribute(key, value);
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
  console.log(`Updating child at index ${index}:`, existingElement);

  // Helper function to normalize children to arrays
  const normalizeChildren = (
    children: VNode | VNode[] | string | number | null | undefined
  ): VNode[] => {
    if (Array.isArray(children)) {
      return children;
    } else if (children != null) {
      return [children];
    } else {
      return [];
    }
  };

  // 새 노드만 있는 경우 (추가)
  if ((oldVdom === null || oldVdom === undefined) && newVdom !== null && newVdom !== undefined) {
    console.log('여기가 처음이니!');
    parent.appendChild(
      typeof newVdom === 'object' && newVdom !== null
        ? createElement(newVdom)
        : typeof newVdom === 'number'
          ? document.createTextNode(newVdom.toString())
          : document.createTextNode(String(newVdom))
    );
    console.log(`Appended new node at index ${index}:`, newVdom);
    return;
  }

  // 이전 노드만 있는 경우 (제거)
  if (oldVdom !== null && oldVdom !== undefined && (newVdom === null || newVdom === undefined)) {
    parent.removeChild(existingElement);
    console.log(`Removed node at index ${index}:`, oldVdom);
    return;
  }

  // 둘 다 숫자인 경우
  if (typeof oldVdom === 'number' && typeof newVdom === 'number') {
    if (oldVdom !== newVdom) {
      if (existingElement.nodeType === Node.TEXT_NODE) {
        existingElement.textContent = newVdom.toString();
        console.log(`Updated number node at index ${index}:`, newVdom);
      } else {
        parent.replaceChild(document.createTextNode(newVdom.toString()), existingElement);
        console.log(`Replaced node with number node at index ${index}:`, newVdom);
      }
    }
    return;
  }

  // 둘 다 문자열인 경우
  if (typeof oldVdom === 'string' && typeof newVdom === 'string') {
    if (oldVdom !== newVdom) {
      if (existingElement.nodeType === Node.TEXT_NODE) {
        existingElement.textContent = newVdom;
        console.log(`Updated string node at index ${index}:`, newVdom);
      } else {
        parent.replaceChild(document.createTextNode(newVdom), existingElement);
        console.log(`Replaced node with string node at index ${index}:`, newVdom);
      }
    }
    return;
  }

  // 타입이 다르면 완전히 교체
  if (typeof oldVdom !== typeof newVdom) {
    const newNode =
      typeof newVdom === 'object'
        ? createElement(newVdom)
        : typeof newVdom === 'number'
          ? document.createTextNode(newVdom.toString())
          : document.createTextNode(String(newVdom));
    parent.replaceChild(newNode, existingElement);
    console.log(`Replaced node at index ${index} due to type mismatch:`, newVdom);
    return;
  }

  // 객체 타입의 VNode 처리
  if (typeof oldVdom === 'object' && typeof newVdom === 'object') {
    if (oldVdom?.type !== newVdom?.type) {
      parent.replaceChild(createElement(newVdom!), existingElement);
      console.log(`Replaced node at index ${index} due to type mismatch:`, newVdom);
      return;
    }

    if (typeof newVdom?.type === 'string') {
      // Update props
      updateProps(
        existingElement as HTMLElement,
        (oldVdom as VDOM)?.props,
        (newVdom as VDOM)?.props
      );
      console.log(`Updated props for element at index ${index}:`, newVdom.props);

      // Update children
      const oldChildren = normalizeChildren((oldVdom as VDOM)?.children);
      const newChildren = normalizeChildren((newVdom as VDOM)?.children);
      const max = Math.max(oldChildren.length, newChildren.length);

      for (let i = 0; i < max; i++) {
        updateElement(existingElement as HTMLElement, oldChildren[i], newChildren[i], i);
      }
    } else if (typeof newVdom?.type === 'function') {
      // Component handling
      renderComponent(newVdom.type, newVdom.props, existingElement as HTMLElement);
      console.log(`Updated component at index ${index}:`, newVdom.type.name || 'Anonymous');
    }
  }
};

const updateProps = (
  element: HTMLElement,
  oldProps: Record<string, any> | null,
  newProps: Record<string, any> | null
) => {
  if (!oldProps) oldProps = {};
  if (!newProps) newProps = {};

  // Remove old props
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith('on') && typeof oldProps[key] === 'function') {
        element.removeEventListener(key.substring(2).toLowerCase(), oldProps[key]);
      } else {
        element.removeAttribute(key);
      }
    }
  }

  // Add new props
  for (const key in newProps) {
    if (key.startsWith('on') && typeof newProps[key] === 'function') {
      if (oldProps[key] !== newProps[key]) {
        if (oldProps[key]) {
          element.removeEventListener(key.substring(2).toLowerCase(), oldProps[key]);
        }
        element.addEventListener(key.substring(2).toLowerCase(), newProps[key]);
      }
    } else {
      if (oldProps[key] !== newProps[key]) {
        element.setAttribute(key, newProps[key]);
      }
    }
  }
};
