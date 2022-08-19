/// <reference types="react" />
import { View, Text, TouchableOpacityProps, TextInputProps, ImageBackgroundProps } from "react-native";
declare const AnimatedText: import("@react-spring/native").AnimatedComponent<typeof Text>;
declare const AnimatedView: import("@react-spring/native").AnimatedComponent<typeof View>;
declare const AnimatedTouchableOpacity: import("@react-spring/native").AnimatedComponent<import("react").ElementType<TouchableOpacityProps>>;
declare const AnimatedTextInput: import("@react-spring/native").AnimatedComponent<import("react").ElementType<TextInputProps>>;
declare const AnimatedImageBackground: import("@react-spring/native").AnimatedComponent<import("react").ElementType<ImageBackgroundProps>>;
export { AnimatedView, AnimatedText, AnimatedTouchableOpacity, AnimatedTextInput, AnimatedImageBackground, };
