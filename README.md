# react-helpers-native

components

- TransitionView ✅
- KeyboardAvoidingView
- animated (AnimatedView AnimatedText) ✅

hooks

- useSafeArea
- useKeyboard
- usePrevious ✅
- useBatchObjectState ✅

utils

- addFlex ✅
- addAbsolute ✅
- addIsAccessible
- addAccessibleButtonProps

### Getting Started

```ts
// package.json
"dependencies": { "react-helpers-native": "github:Conduct/react-helpers-native#v0.2.10" }
```

_installing a specific version tag helps to avoid unexpected updates_

## TransitonView

A wrapper to animate child components  
example uses:

- Accordion content
- Fading loading spinner
- Routing content transitions
- Auto animated lists / search results

![Example](TransitionViewExample.gif)

Animate a views children by using a TransitionView, supporting

- crossfading
- sliding existing items
- auto height transitions

`NOTE: each child needs a unique key`  
_Hiding/showing form input error text_

```tsx
<TransitionView contentChangedKey={inlineErrorTexts.join("")} overflow="hidden">
  {hasVisibleErrors && (
    <Text key={inlineErrorTexts.join("")} style={styles.errors}>
      {inlineErrorTexts.join(", ")}
    </Text>
  )}
</TransitionView>
```

_Showing an animated list_

```tsx
<TransitionView contentChangedKey={wordList.join("")} slideExistingItems>
  {wordList.map((word) => (
    <View key={word} style={{ padding: 4, margin: 4 }}>
      <Text> {word} </Text>
    </View>
  ))}
</TransitionView>
```

_Props_

```ts
type Props = {
  contentChangedKey: string | boolean; // lets the component know the content has changed
  speed?: number; // multiplies the default speed (1.0 is default)
  style?: StyleProp<ViewStyle>;
  childWrapperStyle?: StyleProp<ViewStyle>; // for the view wrapping each child (to measure height)
  childOuterWrapperStyle?: StyleProp<ViewStyle>; // for the view wrapping each child wrapper (to set y position)
  renderWhenNoChildren?: boolean;
  overflow?: OverflowMode; // "hidden" | "visible" | "whenShrinking" | "whenGrowing"
  direction?: "vertical" | "horizontal"; // TODO
  children: FadableChild[] | FadableChild; // ReactElement | false | null | undefined
  initialChildHeight?: number;
  hasBackground?: boolean; // whether the faded content has a background, enabling this stops a flash of 0.5 opacity when fading between two items
  slideExistingItems?: boolean; // So children with same keys slide to new positions instead of fading out and in
  fillParentHeight?: boolean; // fills the parent elements height instead of shrinking to children, still grows with children
} & ViewProps;
```

## Development

For a quick way to edit this package, add `📂src` to your project as a renamed local folder like `📂react-helpers-native-dev`, and replacing imports from `"react-helpers-native"` to `"react-helpers-native-dev"`.  
Enabling `"baseUrl":` in `tsconfig.json` allows non-relative imports

After making changes, update the files in this libraries src folder, update the version number in package.json and the readme, remove node_modules and lib folders, and run `npm install`.

Then the library can be pushed , ideally tagged as the new version number.
