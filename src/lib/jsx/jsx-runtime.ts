export type VNode = string | number | VDOM | null | undefined;

export type Props<P = unknown> = Record<string, P>;

export type VDOM<P = unknown> = {
  type: string | Component<P>;
  props: Props<P> | null;
  children: VNode[];
  key?: string | number;
};

export type Component<P = unknown> = (props?: Props<P>) => VNode;

export const Fragment = (props: { children?: VNode | VNode[] }) => props.children;

export const h = <P = unknown>(
  component: string | Component<P>,
  props: Props<P> | null,
  ...children: VNode[]
): VDOM<P> => {
  return {
    type: component,
    props: props || {},
    children: children.flat(),
  };
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [tagName: string]: Props<unknown>;
    }
  }
}
