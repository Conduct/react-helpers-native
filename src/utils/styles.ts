// Style utils

export type PositionStyle = "relative" | "absolute";

//
type AddFlexOptions = {
  x: "left" | "center" | "right" | "stretch" | "space-between";
  y: "top" | "center" | "bottom" | "stretch" | "space-between";
  direction?: "right" | "down";
};

type AlignItemsProperty =
  | "flex-start"
  | "center"
  | "flex-end"
  | "stretch"
  | "baseline";
type JustifyContentProperty =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-around"
  | "space-between"
  | "space-evenly";

const xPropertyToFlex = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  stretch: "stretch",
  "space-between": "space-between",
} as const;

const yPropertyToFlex = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
  stretch: "stretch",
  "space-between": "space-between",
} as const;

export function addFlex({ x, y, direction }: AddFlexOptions) {
  const flexDirection = direction === "right" ? "row" : "column";
  let alignItems: AlignItemsProperty = "center" as const;
  let justifyContent: JustifyContentProperty = "center" as const;

  switch (direction) {
    case "right":
      if (x !== "stretch") {
        justifyContent = xPropertyToFlex[x];
      }
      if (y !== "space-between") {
        alignItems = yPropertyToFlex[y];
      }
      break;
    case "down":
      if (x !== "space-between") {
        alignItems = xPropertyToFlex[x];
      }
      if (y !== "stretch") {
        justifyContent = yPropertyToFlex[y];
      }
  }

  return {
    display: "flex",
    flexDirection,
    alignItems,
    justifyContent,
  } as const;
}

type UseAbsoluteOptions = {
  left?: number | string;
  top?: number | string;
  bottom?: number | string;
  right?: number | string;
};

export function addAbsolute({
  left,
  top,
  bottom,
  right,
}: UseAbsoluteOptions = {}) {
  const editedOffsets = { left, top, bottom, right };
  const hasAVerticalOffset = top !== undefined || bottom !== undefined;
  const hasAHorizontalOffset = left !== undefined || right !== undefined;
  if (!hasAVerticalOffset) {
    editedOffsets.top = 0;
  }
  if (!hasAHorizontalOffset) {
    editedOffsets.left = 0;
  }

  return {
    position: "absolute",
    ...editedOffsets,
  } as const;
}
