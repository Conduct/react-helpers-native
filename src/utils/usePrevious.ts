import { useRef, useEffect } from "react";

export default function usePrevious<T_Value extends any>(value: T_Value) {
  const ref = useRef(value); // could start as undefined too
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
