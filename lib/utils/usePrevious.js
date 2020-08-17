import { useRef, useEffect } from "react";
export default function usePrevious(value) {
    var ref = useRef(value); // could start as undefined too
    useEffect(function () {
        ref.current = value;
    }, [value]);
    return ref.current;
}
