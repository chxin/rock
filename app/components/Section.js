'use strict'
import React,{Component,PropTypes} from 'react';

import {View} from 'react-native'
import {GRAY,LIST_BG,} from '../styles/color.js';
import Text from './Text.js';


export default class Section extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.text === nextProps.text){
      return false;
    }
    return true;
  }
  render () {
    if(!this.props.text) return null;
    return (
      <View style={{
          paddingTop:19,
          paddingLeft:16,
          paddingBottom:10,
          backgroundColor:LIST_BG,
        }}>
        <Text style={{
            fontSize:14,
            color:GRAY,}}>{this.props.text}</Text>
      </View>

    );
  }
}
Section.propTypes = {
  text:PropTypes.string,
}
