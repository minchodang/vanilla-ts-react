import { VNode } from '@/lib/jsx/jsx-runtime';
import { createElement } from './client';

/**
 * 텍스트 노드 비교 함수
 * 둘 다 텍스트( string | number ) 노드일 때 내용이 다른지 확인
 */
function diffTextVDOM(newVDOM: VNode, oldVDOM: VNode) {
  const newIsText = typeof newVDOM === 'string' || typeof newVDOM === 'number';
  const oldIsText = typeof oldVDOM === 'string' || typeof oldVDOM === 'number';

  // 둘 다 텍스트라면 내용 비교
  if (newIsText && oldIsText) {
    return newVDOM !== oldVDOM;
  }
  return false;
}

/**
 * 실제 DOM을 newVDOM으로 업데이트한다.
 * currentVDOM은 기존 VDOM(이전 상태)이며, parent.childNodes[index]가 실제 DOM 노드
 */
function updateElement(
  parent: Element,
  newVDOM?: VNode | null,
  oldVDOM?: VNode | null,
  index: number = 0
) {
  // 만약 기존 DOM 노드가 없거나, 배열 범위를 넘어서면? (안전성 검사)
  if (index >= parent.childNodes.length && !newVDOM) {
    return; // 추가/삭제할 노드가 모두 없음
  }

  // step 1: 새 노드가 없을 경우 → 기존 DOM 노드 제거
  if (newVDOM == null) {
    if (oldVDOM != null && index < parent.childNodes.length) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  // step 2: 기존 노드가 없을 경우 → 새 노드 추가
  if (oldVDOM == null) {
    parent.appendChild(createElement(newVDOM));
    return;
  }

  // 텍스트 vs 엘리먼트 분기
  const newIsText = typeof newVDOM === 'string' || typeof newVDOM === 'number';
  const oldIsText = typeof oldVDOM === 'string' || typeof oldVDOM === 'number';

  // 둘 다 텍스트 노드일 경우
  if (newIsText && oldIsText) {
    if (diffTextVDOM(newVDOM, oldVDOM)) {
      // 내용이 달라졌다면 교체
      parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    }
    // 내용이 같다면 아무것도 안 함
    return;
  }

  // 새 노드는 텍스트, 기존 노드는 엘리먼트
  if (newIsText && !oldIsText) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  // 새 노드는 엘리먼트, 기존 노드는 텍스트
  if (!newIsText && oldIsText) {
    parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
    return;
  }

  // 여기까지 왔으면 둘 다 엘리먼트(객체 VNode)라고 가정
  // VNode 구조상 type이 string(태그) 또는 함수(컴포넌트)일 것
  if (!newVDOM || !oldVDOM) return;

  // 타입이 다르면 교체
  if (
    typeof newVDOM !== 'string' &&
    typeof oldVDOM !== 'string' &&
    typeof newVDOM !== 'number' &&
    typeof oldVDOM !== 'number'
  ) {
    // (안전성 체크) newVDOM.type과 oldVDOM.type이 다른 경우
    if (newVDOM.type !== oldVDOM.type) {
      parent.replaceChild(createElement(newVDOM), parent.childNodes[index]);
      return;
    }

    // 여기서부터는 같은 타입의 엘리먼트
    // 1) 속성 업데이트
    updateAttributes(parent.childNodes[index] as Element, newVDOM.props ?? {}, oldVDOM.props ?? {});

    // 2) 자식 노드 비교
    const newChildren = newVDOM.children || [];
    const oldChildren = oldVDOM.children || [];
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateElement(parent.childNodes[index] as Element, newChildren[i], oldChildren[i], i);
    }
  }
}

/**
 * 속성 업데이트 함수
 * - 새로운 props와 기존 props를 비교하여 DOM 속성을 업데이트 / 제거
 */
function updateAttributes(
  target: Element,
  newProps: Record<string, any>,
  oldProps: Record<string, any>
) {
  // 추가/수정
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    if (attr.startsWith('on') && typeof value === 'function') {
      // 이벤트 핸들러
      const eventName = attr.slice(2).toLowerCase();
      (target as HTMLElement).addEventListener(eventName, value);
    } else if (attr !== 'key') {
      // 일반 속성 (key는 DOM 속성으로 넣지 않음)
      (target as any)[attr] = value;
    }
  }

  // 제거
  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    // 이벤트 핸들러 제거
    if (attr.startsWith('on') && typeof oldProps[attr] === 'function') {
      const eventName = attr.slice(2).toLowerCase();
      (target as HTMLElement).removeEventListener(eventName, oldProps[attr]);
    } else if (attr.startsWith('class')) {
      target.removeAttribute('class');
    } else if (attr !== 'key') {
      target.removeAttribute(attr);
    }
  }
}

export { updateElement };
