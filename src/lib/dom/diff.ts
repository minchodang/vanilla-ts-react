import { VNode } from '@/lib/jsx/jsx-runtime';
import { createElement } from './client';

const diffTextVDOM = (newVDOM: VNode, currentVDOM: VNode) => {
  // 텍스트 노드인지 확인
  const isNewText = typeof newVDOM === 'string' || typeof newVDOM === 'number';
  const isCurrentText = typeof currentVDOM === 'string' || typeof currentVDOM === 'number';

  // 둘 다 텍스트 노드일 때
  if (isNewText && isCurrentText) {
    return newVDOM !== currentVDOM;
  }

  // 텍스트 노드가 아니거나 타입이 다를 때는 무시
  return false;
};

const updateElement = (
  parent: Element,
  newVDOM?: VNode | null,
  currentVDOM?: VNode | null,
  index: number = 0
) => {
  let removeIndex: undefined | number = undefined;

  const hasOnlyCurrentVDOM =
    newVDOM === null ||
    (newVDOM === undefined && currentVDOM !== null && currentVDOM !== undefined);

  const hasOnlyNewVDOM =
    newVDOM !== null &&
    newVDOM !== undefined &&
    (currentVDOM === null || currentVDOM === undefined);

  //1.
  if (parent.childNodes) {
    if (hasOnlyCurrentVDOM) {
      parent.removeChild(parent.childNodes[index]);
      return index;
    }
  }

  //2.
  if (hasOnlyNewVDOM) {
    parent.appendChild(createElement(newVDOM));
    return;
  }

  //3.
  if (diffTextVDOM(newVDOM, currentVDOM)) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  if (typeof newVDOM === 'number' || typeof newVDOM === 'string') return;
  if (typeof currentVDOM === 'number' || typeof currentVDOM === 'string') return;
  if (!newVDOM || !currentVDOM) return;

  //4.
  if (newVDOM.type !== currentVDOM.type) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  //5.
  updateAttributes(
    parent.childNodes[index] as Element,
    newVDOM.props ?? {},
    currentVDOM.props ?? {}
  );

  //6.
  const maxLength = Math.max(newVDOM.children.length, currentVDOM.children.length);
  for (let i = 0; i < maxLength; i++) {
    const _removeIndex = updateElement(
      parent.childNodes[index] as Element,
      newVDOM.children[i],
      currentVDOM.children[i],
      removeIndex ?? i
    );
    console.log('removeIndex', _removeIndex);
    removeIndex = _removeIndex;
  }
};

function updateAttributes(
  target: Element,
  newProps: Record<string, any>,
  oldProps: Record<string, any>
) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    (target as any)[attr] = value;
  }

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    if (attr.startsWith('on')) {
      (target as any)[attr] = null;
    } else if (attr.startsWith('class')) {
      target.removeAttribute('class');
    } else {
      target.removeAttribute(attr);
    }
  }
}

export { updateElement };
