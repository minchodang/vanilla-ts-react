import type { VNode, Props, Component } from '@/lib/jsx/jsx-runtime';
import { createElement } from './dom';

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
  // 컴포넌트의 키를 생성 (props.key가 있다면 사용)
  const instanceKey = props.key || 'default';
  // 기존 인스턴스 찾기
  let instanceMap = componentInstances.get(Component as Component<unknown>);
  let instance = instanceMap?.get(instanceKey as string);

  if (instance) {
    // 기존 인스턴스가 있다면 props만 업데이트
    instance.props = props;
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
      },
    };

    // 인스턴스 맵에 저장
    if (!instanceMap) {
      instanceMap = new Map<string, ComponentInstance<unknown>>();
      componentInstances.set(Component as Component<unknown>, instanceMap);
    }
    instanceMap.set(instanceKey as string, instance);
  }

  instance.rerender();
  return instance.element!;
};

export const updateComponent = <P = unknown>(
  instance: ComponentInstance<P>,
  newProps: Props<P>
): VNode => {
  instance.props = newProps;
  instance.hookIndex = 0;
  setCurrentInstance(instance);
  const newVdom = instance.render();
  clearCurrentInstance();
  return newVdom;
};

// 컴포넌트 정리 함수 개선
export const cleanupComponent = <P = unknown>(instance: ComponentInstance<P>) => {
  const instanceMap = componentInstances.get(instance.Component as Component<unknown>);
  if (instanceMap && typeof instance.key === 'string') {
    instanceMap.delete(instance.key);
  }

  instance.element = null;
  instance.hooks = [];
};
