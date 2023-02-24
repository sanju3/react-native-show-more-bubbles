import React, { FunctionComponent, useMemo, useRef } from 'react';
import { Animated, Image, LayoutRectangle, PanResponder, PanResponderInstance, Platform, ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface BubbleLayout {
  [key: string]: LayoutRectangle;
}

interface Dimentions {
  [key: string]: {
    text?: number;
    scroll?: number;
  };
}

interface AnimatedValue extends Animated.Value {
  _value: number;
}
export interface BubbleProps {
  text: string;
  removeBubble: (id: string) => void;
  focus: boolean;
  setInvisibleCount: (obj: BubbleLayout) => void;
  bubbleCount: number;
  bubbleStyles?: StyleProp<ViewStyle>;
}

let layoutDimentions: Dimentions = {};

export const Bubble: FunctionComponent<BubbleProps> = (props) => {
  const { text, setInvisibleCount, bubbleStyles, focus, removeBubble, bubbleCount } = props;
  const translateX = useRef<Animated.Value>(new Animated.Value(0)).current;
  let location = useRef<number>(0).current;
  let panResponder = useMemo<PanResponderInstance>(() => {
    location = 0;
    translateX.setValue(0);
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        location = (translateX as AnimatedValue)._value;
        translateX.setValue(location);
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        translateX.setValue(dx + location);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { vx, dx } = gestureState;
        if (location + dx > 0) {
          location = 0;
          Animated.spring(translateX, {
            toValue: location,
            bounciness: 10,
            useNativeDriver: false
          }).start();
        } else if (Math.abs(location + dx) + (layoutDimentions[text]?.scroll ?? 0) > (layoutDimentions[text]?.text ?? 0)) {
          location = (layoutDimentions[text]?.scroll ?? 0) - (layoutDimentions[text]?.text ?? 0);
          Animated.spring(translateX, {
            toValue: location,
            bounciness: 10,
            useNativeDriver: false
          }).start();
        } else {
          const freeFall = dx > 0 ? dx * vx : -Math.abs(dx * vx);
          if (dx > 0 && location + dx + freeFall > 0) {
            location = 0;
            Animated.spring(translateX, {
              toValue: location,
              bounciness: 10,
              useNativeDriver: false
            }).start(() => (location = (translateX as AnimatedValue)._value));
          } else if (dx < 0 && Math.abs(location + dx + freeFall) + (layoutDimentions[text]?.scroll ?? 0) > (layoutDimentions[text]?.text ?? 0)) {
            location = (layoutDimentions[text]?.scroll ?? 0) - (layoutDimentions[text]?.text ?? 0);
            Animated.spring(translateX, {
              toValue: location,
              bounciness: 10,
              useNativeDriver: false
            }).start(() => (location = (translateX as AnimatedValue)._value));
          } else {
            location = location + dx + freeFall;
            Animated.spring(translateX, {
              toValue: location,
              friction: 10,
              useNativeDriver: false
            }).start(() => (location = (translateX as AnimatedValue)._value));
          }
        }
      }
    });
  }, [text, focus]);

  return (
    <View onLayout={(e) => setInvisibleCount({ [text]: e.nativeEvent.layout })} style={[style.container, bubbleStyles, !focus && bubbleCount === 1 && { maxWidth: '70%' }]}>
      {focus ? (
        <View style={style.textView}>
          <Text style={style.textUnfocus} allowFontScaling={false}>
            {text}
          </Text>
        </View>
      ) : (
        <View style={{ maxWidth: '100%' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            onLayout={(e) => {
              layoutDimentions = {
                ...layoutDimentions,
                [text]: {
                  ...layoutDimentions[text],
                  scroll: e.nativeEvent.layout.width
                }
              };
            }}
          >
            <Animated.View style={{ transform: [{ translateX: translateX }] }} {...panResponder.panHandlers}>
              <Text
                style={style.textUnfocus}
                selectable={false}
                onLayout={(e) => {
                  layoutDimentions = {
                    ...layoutDimentions,
                    [text]: {
                      ...layoutDimentions[text],
                      text: e.nativeEvent.layout.width
                    }
                  };
                }}
                allowFontScaling={false}
              >
                {text}
              </Text>
            </Animated.View>
          </ScrollView>
        </View>
      )}
      {focus && (
        <View style={style.deleteIcon}>
          <TouchableOpacity onPress={() => removeBubble(text)}>
            <Image source={require('../assets/CloseNew.png')} style={style.deleteIconSize} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    borderColor: '#3271C6',
    borderRadius: 22,
    paddingBottom: 5,
    paddingTop: 5,
    marginBottom: 5,
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    maxWidth: '100%',
    backgroundColor: '#F6FAFF',
    flexDirection: 'row'
  },
  textView: {
    paddingRight: 20,
    maxWidth: '100%'
  },
  textUnfocus: {
    color: '#3271C6',
    fontFamily: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Asap' : 'Asap, sans-serif',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flexWrap: 'wrap'
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  deleteIconSize: {
    width: 13,
    height: 13
  }
});
