export type VNode = string | number | VDOM | null | undefined;

export interface Component<P = unknown> {
  (props: Props<P>): VNode;
  isMemoized?: boolean;
}

export type Props<P = unknown> = P & {
  children?: VDOM;
  key?: string | number;
  [key: string]: unknown;
};

export type VDOM<P = unknown> = {
  type: string | Component<P>;
  props: Props<P> | null;
  children: VNode[];
  isMemoized?: boolean;
  key?: string | number;
};

export type DependencyList = readonly unknown[];

export const Fragment = (props: { children?: VNode | VNode[] }) => props.children;

export const h = <P = unknown>(
  component: string | Component<P>,
  props: Props<P> | null,
  ...children: VNode[]
): VDOM<P> => {
  return {
    type: component,
    props: props || ({} as Props<P>),
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
