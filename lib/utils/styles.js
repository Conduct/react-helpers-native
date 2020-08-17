// Style utils
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
var xPropertyToFlex = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    stretch: "stretch",
    "space-between": "space-between",
};
var yPropertyToFlex = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
    stretch: "stretch",
    "space-between": "space-between",
};
export function addFlex(_a) {
    var x = _a.x, y = _a.y, direction = _a.direction;
    var flexDirection = direction === "right" ? "row" : "column";
    var alignItems = "center";
    var justifyContent = "center";
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
        flexDirection: flexDirection,
        alignItems: alignItems,
        justifyContent: justifyContent,
    };
}
export function addAbsolute(_a) {
    var _b = _a === void 0 ? {} : _a, left = _b.left, top = _b.top, bottom = _b.bottom, right = _b.right;
    var editedOffsets = { left: left, top: top, bottom: bottom, right: right };
    var hasAVerticalOffset = top !== undefined || bottom !== undefined;
    var hasAHorizontalOffset = left !== undefined || right !== undefined;
    if (!hasAVerticalOffset) {
        editedOffsets.top = 0;
    }
    if (!hasAHorizontalOffset) {
        editedOffsets.left = 0;
    }
    return __assign({ position: "absolute" }, editedOffsets);
}
