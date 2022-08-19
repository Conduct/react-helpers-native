var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useRef, useCallback } from "react";
// a useState that batches multiple setStates into one on the next frame to prevent many rerenders
// It can be useful for a component where children update the parents state
// NOTE: could make this useBatchUpdateState and have it work for non objects too
export default function useBatchObjectState(initialValue) {
    var _a = useState(initialValue), thisState = _a[0], setThisState = _a[1];
    var local = useRef({
        frameIsQueued: false,
        statesToMerge: [],
    }).current;
    var setThisStateOnNextFrame = useCallback(function (newPartialState) {
        local.statesToMerge.push(newPartialState);
        if (!local.frameIsQueued) {
            local.frameIsQueued = true;
            requestAnimationFrame(function () {
                var newState = Object.assign.apply(Object, __spreadArray([{}], local.statesToMerge, false));
                setThisState(function (state) { return (__assign(__assign({}, state), newState)); });
                local.frameIsQueued = false;
                local.statesToMerge = [];
            });
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return [thisState, setThisStateOnNextFrame];
}
