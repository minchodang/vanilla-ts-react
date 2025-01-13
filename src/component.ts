import { VNode } from '@/lib/jsx/jsx-runtime';
import { updateElement } from './dom';
import { setCurrentInstance, clearCurrentInstance } from './state';

interface ComponentInstance {
  render: () => VNode;
  hooks: any[];
  hookIndex: number;
  container: HTMLElement;
  prevVdom: VNode | null;
  isRendering: boolean;
  rerender: () => void;
}

const instances = new Map<HTMLElement, ComponentInstance>();

export const renderComponent = (component: Function, props: any, container: HTMLElement) => {
  let instance = instances.get(container);

  if (!instance) {
    instance = {
      render: () => component(props),
      hooks: [],
      hookIndex: 0,
      container,
      prevVdom: null,
      isRendering: false,
      rerender: () => {
        if (instance!.isRendering) return; // 재귀 방지
        instance!.isRendering = true;
        instance!.hookIndex = 0;
        setCurrentInstance(instance!); // 인스턴스를 스택에 추가
        const newVdom = instance!.render();
        updateElement(container, instance!.prevVdom, newVdom);
        instance!.prevVdom = newVdom;
        clearCurrentInstance(); // 인스턴스를 스택에서 제거
        instance!.isRendering = false;
      },
    };
    instances.set(container, instance);
  }

  instance.rerender();
};
