export type VNode = string | number | VDOM | null | undefined;

export type VDOM = {
  type: string | Function;
  props: Record<string, any> | null;
  children: VNode[];
  key?: string | number;
};

export type Component = (props?: Record<string, any>) => VNode;

export const Fragment = (props: { children?: any }) => props.children;

export const h = (
  component: string | Component,
  props: Record<string, any> | null,
  ...children: VNode[]
): VNode => {
  return {
    type: component,
    props: props || {},
    children: children.flat(),
  };
};
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [tagName: string]: Record<string, any>;
    }
  }
}
