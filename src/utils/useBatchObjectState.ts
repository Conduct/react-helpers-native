import React, {
  ReactElement,
  useState,
  useRef,
  ComponentProps,
  useEffect,
  useCallback,
} from "react";

// a useState that batches multiple setStates into one on the next frame to prevent many rerenders
// It can be useful for a component where children update the parents state
// NOTE: could make this useBatchUpdateState and have it work for non objects too

export default function useBatchObjectState<
  T_StateObject extends Record<any, any>
>(initialValue: T_StateObject) {
  const [thisState, setThisState] = useState(initialValue);

  const { current: local } = useRef({
    frameIsQueued: false,
    statesToMerge: [] as Partial<T_StateObject>[],
  });

  const setThisStateOnNextFrame = useCallback(
    (newPartialState: Partial<T_StateObject>) => {
      console.log(newPartialState);
      local.statesToMerge.push(newPartialState);
      if (!local.frameIsQueued) {
        local.frameIsQueued = true;

        requestAnimationFrame(() => {
          const newState: T_StateObject = Object.assign(
            {},
            ...local.statesToMerge
          );
          setThisState((state) => ({ ...state, ...newState }));
          local.frameIsQueued = false;
          local.statesToMerge = [];
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [thisState, setThisStateOnNextFrame] as const;
}
