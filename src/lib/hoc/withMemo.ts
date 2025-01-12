import { shallowEqual } from '../utils/shallowEqual';

type Component<P> = (props: P) => any;

const withMemo = <P>(
  WrappedComponent: Component<P>,
  equalFn: (prevProps: P, nextProps: P) => boolean = shallowEqual
) => {
  let lastProps: P | null = null;
  let lastResult: any = null;

  return (props: P) => {
    const hasChanged = lastProps === null || !equalFn(lastProps, props);

    console.log('Previous Props:', lastProps);
    console.log('Current Props:', props);
    console.log('Has Changed:', hasChanged);

    if (hasChanged) {
      lastProps = props;
      lastResult = WrappedComponent(props);
    }

    return lastResult !== null ? lastResult : WrappedComponent(props);
  };
};

export default withMemo;
