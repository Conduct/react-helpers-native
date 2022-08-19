import { animated } from "@react-spring/native";
import {
  ViewProps,
  View,
  TextProps,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
  TextInputProps,
  TextInput,
  ImageBackgroundProps,
  ImageBackground,
} from "react-native";

const AnimatedText = animated(Text);
const AnimatedView = animated(View);
const AnimatedTouchableOpacity =
  animated<React.ElementType<TouchableOpacityProps>>(TouchableOpacity);
const AnimatedTextInput =
  animated<React.ElementType<TextInputProps>>(TextInput);
const AnimatedImageBackground =
  animated<React.ElementType<ImageBackgroundProps>>(ImageBackground);

export {
  AnimatedView,
  AnimatedText,
  AnimatedTouchableOpacity,
  AnimatedTextInput,
  AnimatedImageBackground,
};
