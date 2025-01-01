import type { VNode } from '@/lib/jsx/jsx-runtime';

// 전역 선언
declare global {
  namespace JSX {
    // 1) <div> 등 HTML 태그가 어떤 속성을 받을지
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    // 2) <App /> 같은 사용자 정의 컴포넌트의 결과(반환값) 타입
    //    => 결국 우리가 원하는 타입(VNode)로 정의
    type Element = VNode;
  }
}

export {};
