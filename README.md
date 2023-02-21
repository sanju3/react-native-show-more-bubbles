# react-native-show-more-bubbles

React native textinput with show hide excess data feature

## Installation

yarn add react-native-show-more-bubbles

## Basic usage

- **preSelectedValues**(array)(*required): selected values
- **onChangeBubbles**(func)(*required): get the entered data
- **wrapperStyles**(object)(*required): component wrapper styles required to add width style  

```javascript

import React, {useState} from 'react';
import {View} from 'react-native';
import {MainBubble, unFocus} from 'react-native-show-more-bubbles';

const App = () => {
  const [bubbles, setBubbles] = useState([]);
  return (
    <View onStartShouldSetResponder={unFocus}>
      <MainBubble
        suggestions={['suggestion 01', 'suggestion 02', 'suggestion 03', 'suggestion 04']}
        preSelectedValues={bubbles}
        onChangeBubbles={b => setBubbles(b)}
        mainTitle={'Something'}
        wrapperStyles={{width: 300, borderColor: 'red', borderWidth: 1}} // width is required
      />
    </View>
  );
};

export default App;
