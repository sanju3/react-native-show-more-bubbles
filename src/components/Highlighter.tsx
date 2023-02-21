import React, { Fragment, FunctionComponent } from 'react';
import { TextProps, StyleProp, Text, TextStyle } from 'react-native';
import { separator } from '../utils';

export interface HighlighterProps extends TextProps {
  defaultStyles?: StyleProp<TextStyle>;
  highlighterStyles?: StyleProp<TextStyle>;
  pattern: string;
  text: string;
}

export const Highlighter: FunctionComponent<HighlighterProps> = (props) => {
  const { defaultStyles, pattern, text, highlighterStyles, ...rest } = props;
  const chunks = separator(text, pattern);
  return (
    <Text style={defaultStyles} {...rest}>
      {chunks.map((c, i) =>
        c === pattern ? (
          <Text key={i} style={highlighterStyles}>
            {c}
          </Text>
        ) : (
          <Fragment key={i}>{c}</Fragment>
        )
      )}
    </Text>
  );
};
