import type { VNode, Props, Component } from '@/lib/jsx/jsx-runtime';
import { createElement, shallowEqual } from './dom';

// 컴포넌트 상태 관리
let currentInstanceStack: ComponentInstance<any>[] = [];

export const setCurrentInstance = <P>(instance: ComponentInstance<P>): void => {
  currentInstanceStack.push(instance as ComponentInstance<any>);
};

export const clearCurrentInstance = (): void => {
  currentInstanceStack.pop();
};

export const getCurrentInstance = <P>(): ComponentInstance<P> => {
  const instance = currentInstanceStack[currentInstanceStack.length - 1];
  if (!instance) {
    throw new Error('No component instance found.');
  }
  return instance as ComponentInstance<P>;
};

export interface ComponentInstance<P = unknown> {
  element: HTMLElement | null;
  props: Props<P>;
  render: () => VNode;
  hooks: unknown[];
  hookIndex: number;
  prevVdom: VNode | null;
  isRendering: boolean;
  rerender: () => void;
  Component: Component<P>;
  forceUpdate?: boolean;
  key?: string | number;
}

const componentInstances = new WeakMap<
  Component<unknown>,
  Map<string, ComponentInstance<unknown>>
>();

export const renderComponent = <P = unknown>(
  Component: Component<P>,
  props: Props<P>
): HTMLElement => {
  const instanceKey = props.key || 'default';

  let instanceMap = componentInstances.get(Component as Component<unknown>);
  let instance = instanceMap?.get(instanceKey as string);

  if (instance) {
    const shouldUpdate = !instance.forceUpdate && shallowEqual(instance.props, props);
    instance.props = props;

    if (shouldUpdate) {
      // Props가 동일하고 forceUpdate가 아니면 캐시된 DOM 반환
      return instance.element!;
    }
  } else {
    // 새 인스턴스 생성
    instance = {
      element: null,
      props,
      Component: Component as Component<unknown>,
      render: () => Component(props),
      hooks: [],
      hookIndex: 0,
      prevVdom: null,
      isRendering: false,
      key: instanceKey as string | number | undefined,
      forceUpdate: false, // 상태 변경 시 강제 렌더링 플래그
      rerender: function () {
        if (this.isRendering) return;
        this.isRendering = true;
        this.hookIndex = 0;

        setCurrentInstance(this);

        const newVdom = this.render();
        const newElement = createElement(newVdom);

        if (this.element?.parentNode) {
          this.element.parentNode.replaceChild(newElement, this.element);
        }

        if (newElement instanceof HTMLElement) {
          this.element = newElement;
        }
        this.prevVdom = newVdom;

        clearCurrentInstance();
        this.isRendering = false;
        this.forceUpdate = false; // 렌더링 후 초기화
      },
    };

    if (!instanceMap) {
      instanceMap = new Map<string, ComponentInstance<unknown>>();
      componentInstances.set(Component as Component<unknown>, instanceMap);
    }
    instanceMap.set(instanceKey as string, instance);
  }

  instance.rerender();
  return instance.element!;
};

// updateComponent 수정
export const updateComponent = <P = unknown>(
  instance: ComponentInstance<P>,
  newProps: Props<P>
): VNode => {
  const shouldUpdate = !instance.forceUpdate && shallowEqual(instance.props, newProps);
  instance.props = newProps;

  if (shouldUpdate) {
    return instance.prevVdom!;
  }

  setCurrentInstance(instance);
  const newVdom = instance.render();
  clearCurrentInstance();
  return newVdom;
};

// cleanupComponent 유지
export const cleanupComponent = <P = unknown>(instance: ComponentInstance<P>) => {
  const instanceMap = componentInstances.get(instance.Component as Component<unknown>);
  if (instanceMap && typeof instance.key === 'string') {
    instanceMap.delete(instance.key);
  }

  instance.element = null;
  instance.hooks = [];
};
