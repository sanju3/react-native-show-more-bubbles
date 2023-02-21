import React, { FunctionComponent } from 'react';
import { TextProps, StyleProp, ViewStyle, View, StyleSheet, Image, Platform, TextStyle } from 'react-native';
import { Highlighter } from './Highlighter';

export interface TileItemProps extends TextProps {
  defaultStyles?: StyleProp<ViewStyle>;
  highlighterStyles?: StyleProp<TextStyle>;
  pattern: string;
  text: string;
  selectedValues: { [key: string]: string | undefined };
}

export const TileItem: FunctionComponent<TileItemProps> = (props) => {
  const { pattern, text, selectedValues, highlighterStyles } = props;
  const selected = selectedValues[text];
  return (
    <View style={style.container}>
      {selected ? (
        <Image style={style.icon} source={require('../assets/common/selection-round-tick.png')} />
      ) : (
        <Image style={style.icon} source={require('../assets/common/selection-round-default.png')} />
      )}
      <View style={{ maxWidth: '90%' }}>
        <Highlighter
          highlighterStyles={
            highlighterStyles || {
              fontWeight: 'bold',
              color: 'black'
            }
          }
          defaultStyles={style.textMain}
          allowFontScaling={false}
          pattern={pattern}
          text={text}
          numberOfLines={1}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    zIndex: 9999
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginTop: 3,
    marginRight: 8
  },
  textMain: {
    marginRight: 5,
    fontSize: 14,
    color: '#404041',
    fontFamily: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Asap' : 'Asap, sans-serif'
  }
});
