// @refresh reset

/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/

import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  ViewProps,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSpring, useTransition } from "@react-spring/native";
import { AnimatedView } from "../../components/animated";
import usePrevious from "../../utils/usePrevious";
import useBatchObjectState from "../../utils/useBatchObjectState";

type FadableChild = ReactElement | Element | false | null | undefined;

type OverflowMode = "hidden" | "visible" | "whenShrinking" | "whenGrowing";

type Props = {
  contentChangedKey: string | boolean; // lets the component know the content has changed
  speed?: number; // multiplies the default speed (1.0 is default)
  style?: StyleProp<ViewStyle>;
  childWrapperStyle?: StyleProp<ViewStyle>; // for the view wrapping each child (to measure height)
  childOuterWrapperStyle?: StyleProp<ViewStyle>; // for the view wrapping each child wrapper (to set y position)
  renderWhenNoChildren?: boolean;
  overflow?: OverflowMode;
  direction?: "vertical" | "horizontal";
  children: FadableChild[] | FadableChild;
  initialChildHeight?: number;
  // whether the faded content has a background, enabling this stops a flash of 0.5 opacity when fading between two items
  hasBackground?: boolean;
  // So children with same keys slide to new positions instead of fading out and in
  slideExistingItems?: boolean;
  fillParentHeight?: boolean; // fills the parent elements height instead of shrinking to children, still grows with children
} & ViewProps;

/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/

// used to get a relative time, since Date.now() returned number is too large for zIndex, and can cause a crash with react-native bridge
const fileOpenedTime = Date.now();

const TransitionViewWithoutMemo: React.FC<Props> = ({
  contentChangedKey,
  speed = 1,
  renderWhenNoChildren = true,
  overflow = "hidden",
  children,
  style,
  childWrapperStyle,
  childOuterWrapperStyle,
  hasBackground = false,
  initialChildHeight = 0,
  slideExistingItems = true,
  fillParentHeight = undefined,
  ...otherProps
}) => {
  const [measuredChildHeightsByKey, setMeasuredChildHeightsByKey] =
    useBatchObjectState({} as Record<string, number>);

  const [measuredParentHeight, setMeasuredParentHeight] = useState(0);
  const [hasMeasuredParent, setHasMeasuredParent] = useState(false);
  const prevHeightFromParent = usePrevious(fillParentHeight);

  useEffect(() => {
    // Set to remeasure the parent height if fillParentHeight became active
    if (!prevHeightFromParent && fillParentHeight) {
      setMeasuredParentHeight(0);
      setHasMeasuredParent(false);
    }
  }, [fillParentHeight, prevHeightFromParent, contentChangedKey]);

  const childrenArray = React.Children.toArray(children) as ReactElement[];
  // like "this" , stores values in an object so callbacks can use the latest values
  const { current: local } = useRef({
    shouldHideOverflow: false,
    prevTotalChildrenHeight: 0,
    totalChildrenHeight: 0,
    childAmount: childrenArray.length,
  });

  local.childAmount = childrenArray.length;

  const [shouldRender, setShouldRender] = useState(childrenArray.length > 0);

  if (!renderWhenNoChildren && local.childAmount > 0 && !shouldRender) {
    setShouldRender(true);
  }

  local.totalChildrenHeight = 0;
  const childrenListData = childrenArray
    .filter((loopedChild) => {
      if (!loopedChild.key || typeof loopedChild.key !== "string") {
        console.warn("no or incorrect key set for child in TransitionView");
        return false;
      }

      return true;
    })
    .map((loopedChild, index) => {
      const loopedChildId = loopedChild.key as string;

      const measuredHeight =
        measuredChildHeightsByKey[loopedChildId] || initialChildHeight;

      local.totalChildrenHeight += measuredHeight;
      return {
        childElement: loopedChild,
        id: loopedChildId,
        y: local.totalChildrenHeight - measuredHeight,
        index,
      };
    });
  const prevTotalChildrenHeight = usePrevious(local.totalChildrenHeight);

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

  const heightMotionProps = useSpring({
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
  const rerenderTime = Date.now() - fileOpenedTime; // minusing fileOpenedTime to keep the number small (e.g 12592 vs 163289321592)

  const [transitions] = useTransition<
    typeof childrenListData[number],
    {
      opacity: number;
      translateY: number;
      delay: number;
      zIndex: number;
    }
  >(
    childrenListData,
    {
      keys: ({ id }) => id + (slideExistingItems ? "" : contentChangedKey),
      from: ({ y }) => ({
        translateY: y,
        // opacity: 0,
        // FIXME NOTE opacity transitions stopped working recently, so have disabled for now
        opacity: 1,
        zIndex: rerenderTime,
      }),
      enter: ({ y }) => ({
        translateY: y,
        opacity: 1,
        zIndex: rerenderTime,
      }),
      leave: ({ y }) => ({
        // opacity: 0,
        // FIXME NOTE opacity transitions stopped working recently, so have disabled for now
        opacity: 1,
        translateY: y,
        delay: hasBackground ? 250 : 0,
        zIndex: rerenderTime - 100,
      }),
      update: ({ y }) => ({
        translateY: y,
        zIndex: rerenderTime,
      }),
      onRest() {
        if (!renderWhenNoChildren && local.childAmount === 0) {
          setShouldRender(false);
        }
      },
      config: { tension: 170 * speed, friction: 24 + speed * 2 },
    },
    [contentChangedKey, measuredChildHeightsByKey]
  );

  if (!renderWhenNoChildren && !shouldRender) {
    return null;
  }

  const mainTransitionView = (
    <AnimatedView
      style={[
        {
          height: heightMotionProps.height,
          minHeight: heightMotionProps.height,
          alignSelf: "stretch",
          overflow: local.shouldHideOverflow ? "hidden" : "visible",
        },
        style,
      ]}
      {...otherProps}
    >
      {transitions(({ translateY, opacity, zIndex }, { id, childElement }) => {
        return (
          <AnimatedView
            style={[
              styles.childElementHolder,
              {
                // alignSelf: "stretch",
                // ...addFlex({ x: "center", y: "center", direction: "down" }),
                transform: [{ translateY }],
                opacity,
                zIndex,
                minHeight:
                  fillParentHeight && hasMeasuredParent
                    ? measuredParentHeight
                    : undefined,
              },
              childOuterWrapperStyle,
            ]}
          >
            <View
              style={[
                childWrapperStyle,
                {
                  minHeight:
                    fillParentHeight && hasMeasuredParent
                      ? measuredParentHeight
                      : undefined,
                },
              ]}
              onLayout={({ nativeEvent }) => {
                const height = nativeEvent.layout.height;
                if (measuredChildHeightsByKey[id] === height) {
                  return;
                }
                setMeasuredChildHeightsByKey({
                  [id]: nativeEvent.layout.height,
                });
              }}
            >
              {childElement}
            </View>
          </AnimatedView>
        );
      })}
    </AnimatedView>
  );

  // if fillParentHeight isn't a boolean dont wrap with the extra view
  if (fillParentHeight === undefined) {
    return mainTransitionView;
  }
  return (
    <View
      style={styles.growToParentWrapper}
      onLayout={({ nativeEvent }) => {
        const height = nativeEvent.layout.height;
        if (measuredParentHeight === height) {
          return;
        }
        if (hasMeasuredParent === false) {
          setMeasuredParentHeight(nativeEvent.layout.height);
          setHasMeasuredParent(true);
        }
      }}
    >
      {mainTransitionView}
    </View>
  );
};

const styles = StyleSheet.create({
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

const TransitionView: React.FC<Props> = React.memo(TransitionViewWithoutMemo);

export default TransitionView;
