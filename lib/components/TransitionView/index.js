// @refresh reset
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, } from "react-native";
import { useSpring, useTransition } from "@react-spring/native";
import { AnimatedView } from "../../components/animated";
import usePrevious from "../../utils/usePrevious";
import useBatchObjectState from "../../utils/useBatchObjectState";
/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/
var TransitionViewWithoutMemo = function (_a) {
    var contentChangedKey = _a.contentChangedKey, _b = _a.speed, speed = _b === void 0 ? 1 : _b, _c = _a.renderWhenNoChildren, renderWhenNoChildren = _c === void 0 ? true : _c, _d = _a.overflow, overflow = _d === void 0 ? "hidden" : _d, children = _a.children, style = _a.style, childWrapperStyle = _a.childWrapperStyle, childOuterWrapperStyle = _a.childOuterWrapperStyle, _e = _a.hasBackground, hasBackground = _e === void 0 ? false : _e, _f = _a.initialChildHeight, initialChildHeight = _f === void 0 ? 0 : _f, _g = _a.slideExistingItems, slideExistingItems = _g === void 0 ? true : _g, _h = _a.fillParentHeight, fillParentHeight = _h === void 0 ? undefined : _h, otherProps = __rest(_a, ["contentChangedKey", "speed", "renderWhenNoChildren", "overflow", "children", "style", "childWrapperStyle", "childOuterWrapperStyle", "hasBackground", "initialChildHeight", "slideExistingItems", "fillParentHeight"]);
    var _j = useBatchObjectState({}), measuredChildHeightsByKey = _j[0], setMeasuredChildHeightsByKey = _j[1];
    var _k = useState(0), measuredParentHeight = _k[0], setMeasuredParentHeight = _k[1];
    var _l = useState(false), hasMeasuredParent = _l[0], setHasMeasuredParent = _l[1];
    var prevHeightFromParent = usePrevious(fillParentHeight);
    useEffect(function () {
        // Set to remeasure the parent height if fillParentHeight became active
        if (!prevHeightFromParent && fillParentHeight) {
            setMeasuredParentHeight(0);
            setHasMeasuredParent(false);
        }
    }, [fillParentHeight, prevHeightFromParent, contentChangedKey]);
    var childrenArray = React.Children.toArray(children);
    // like "this" , stores values in an object so callbacks can use the latest values
    var local = useRef({
        shouldHideOverflow: false,
        prevTotalChildrenHeight: 0,
        totalChildrenHeight: 0,
        childAmount: childrenArray.length,
    }).current;
    local.childAmount = childrenArray.length;
    var _m = useState(childrenArray.length > 0), shouldRender = _m[0], setShouldRender = _m[1];
    if (!renderWhenNoChildren && local.childAmount > 0 && !shouldRender) {
        setShouldRender(true);
    }
    local.totalChildrenHeight = 0;
    var childrenListData = childrenArray
        .filter(function (loopedChild) {
        if (!loopedChild.key || typeof loopedChild.key !== "string") {
            console.warn("no or incorrect key set for child in TransitionView");
            return false;
        }
        return true;
    })
        .map(function (loopedChild, index) {
        var loopedChildId = loopedChild.key;
        var measuredHeight = measuredChildHeightsByKey[loopedChildId] || initialChildHeight;
        local.totalChildrenHeight += measuredHeight;
        return {
            childElement: loopedChild,
            id: loopedChildId,
            y: local.totalChildrenHeight - measuredHeight,
            index: index,
        };
    });
    var prevTotalChildrenHeight = usePrevious(local.totalChildrenHeight);
    local.shouldHideOverflow = overflow === "hidden";
    switch (overflow) {
        case "whenGrowing":
            local.shouldHideOverflow =
                local.totalChildrenHeight < prevTotalChildrenHeight;
            break;
        case "whenShrinking":
            local.shouldHideOverflow =
                local.totalChildrenHeight > prevTotalChildrenHeight;
            break;
    }
    var heightMotionProps = useSpring({
        height: fillParentHeight
            ? Math.max(local.totalChildrenHeight, measuredParentHeight)
            : local.totalChildrenHeight,
        config: {
            bounce: 0,
            friction: 25,
            tension: 200 * speed,
        },
        immediate: fillParentHeight && !hasMeasuredParent,
    });
    // To help keep the fading out children behind the fading in
    var rerenderTime = Date.now();
    var transitions = useTransition(childrenListData, {
        keys: function (_a) {
            var id = _a.id;
            return id + (slideExistingItems ? "" : contentChangedKey);
        },
        from: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                opacity: 0,
                zIndex: rerenderTime,
            });
        },
        enter: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                opacity: 1,
                zIndex: rerenderTime,
            });
        },
        leave: function (_a) {
            var y = _a.y;
            return ({
                opacity: 0,
                translateY: y,
                delay: hasBackground ? 250 : 0,
                zIndex: rerenderTime - 100,
            });
        },
        update: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                zIndex: rerenderTime,
            });
        },
        onRest: function () {
            if (!renderWhenNoChildren && local.childAmount === 0) {
                setShouldRender(false);
            }
        },
        config: { tension: 170 * speed, friction: 24 + speed * 2 },
    }, [contentChangedKey, measuredChildHeightsByKey])[0];
    if (!renderWhenNoChildren && !shouldRender) {
        return null;
    }
    var mainTransitionView = (React.createElement(AnimatedView, __assign({ style: [
            {
                height: heightMotionProps.height,
                minHeight: heightMotionProps.height,
                alignSelf: "stretch",
                overflow: local.shouldHideOverflow ? "hidden" : "visible",
            },
            style,
        ] }, otherProps), transitions(function (_a, _b) {
        var translateY = _a.translateY, opacity = _a.opacity, zIndex = _a.zIndex;
        var id = _b.id, childElement = _b.childElement;
        return (React.createElement(AnimatedView, { style: [
                styles.childElementHolder,
                {
                    // alignSelf: "stretch",
                    // ...addFlex({ x: "center", y: "center", direction: "down" }),
                    transform: [{ translateY: translateY }],
                    opacity: opacity,
                    zIndex: zIndex,
                    minHeight: fillParentHeight && hasMeasuredParent
                        ? measuredParentHeight
                        : undefined,
                },
                childOuterWrapperStyle,
            ] },
            React.createElement(View, { style: [
                    childWrapperStyle,
                    {
                        minHeight: fillParentHeight && hasMeasuredParent
                            ? measuredParentHeight
                            : undefined,
                    },
                ], onLayout: function (_a) {
                    var _b;
                    var nativeEvent = _a.nativeEvent;
                    var height = nativeEvent.layout.height;
                    if (measuredChildHeightsByKey[id] === height) {
                        return;
                    }
                    setMeasuredChildHeightsByKey((_b = {},
                        _b[id] = nativeEvent.layout.height,
                        _b));
                } }, childElement)));
    })));
    // if fillParentHeight isn't a boolean dont wrap with the extra view
    if (fillParentHeight === undefined) {
        return mainTransitionView;
    }
    return (React.createElement(View, { style: styles.growToParentWrapper, onLayout: function (_a) {
            var nativeEvent = _a.nativeEvent;
            var height = nativeEvent.layout.height;
            if (measuredParentHeight === height) {
                return;
            }
            if (hasMeasuredParent === false) {
                setMeasuredParentHeight(nativeEvent.layout.height);
                setHasMeasuredParent(true);
            }
        } }, mainTransitionView));
};
var styles = StyleSheet.create({
    childElementHolder: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
    },
    growToParentWrapper: {
        flex: 1,
        width: "100%",
    },
});
var TransitionView = React.memo(TransitionViewWithoutMemo);
export default TransitionView;
