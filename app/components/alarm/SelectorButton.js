'use strict'

import React,{Component,PropTypes} from 'react';
import {
  View,Text,
  // Animated,
  StyleSheet
} from 'react-native';
import TouchFeedback from '../TouchFeedback.js';
import {GREEN,GRAY,ALARM_FILTER_BUTTON_BORDER} from '../../styles/color';



export default class SelectorButton extends Component {
  constructor(props){
    super(props);
    // var colorValue = 0;
    // if(props.selected){
    //   colorValue = 1;
    // }
    // this.state = { color:new Animated.Value(colorValue), colorValue };
  }
  _onClick(){
    // var nextColorValue = Math.abs(this.state.colorValue - 1);
    // Animated.timing(this.state.color, {toValue: nextColorValue}).start();
    // this.setState({colorValue:nextColorValue});
    this.props.onClick();
  }
  componentWillReceiveProps(nextProps) {
    // if(nextProps.selected !== this.props.selected){
    //   var nextColorValue = Math.abs(this.state.colorValue - 1);
    //   Animated.timing(this.state.color, {toValue: nextColorValue}).start();
    //   this.setState({colorValue:nextColorValue});
    // }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.selected === this.props.selected){
      return false;
    }
    // console.warn('changed');
    return true;
  }
  render () {

    if(!this.props.text){
      return (
        <View style={[styles.item]} >
        </View>
      );
    }


    // var color = this.state.color.interpolate({
    //      inputRange: [0, 1],
    //      outputRange: [ALARM_FILTER_BUTTON,  GREEN]
    // });
    var color = 'white';
    var fontColor = GRAY;
    var borderColor = ALARM_FILTER_BUTTON_BORDER;
    if(this.props.selected){
      color = GREEN;
      fontColor = 'white';
      borderColor = GREEN;
    }
    // var textColor = this.state.color.interpolate({
    //      inputRange: [0, 1],
    //      outputRange: [BLACK,  'white']
    // });
    // var textColor = 'white';

    var fontSize = 15;
    var flexStart = null;
    if(this.props.text.length>10){
      fontSize = 12;
      flexStart = styles.flexStart;
    }


    return (
      <View style={[styles.item,{backgroundColor:color,borderColor,borderWidth:1},this.props.style]}>
        <TouchFeedback style={[styles.button,flexStart]} onPress={()=>this._onClick()}>
          <View style={[styles.button,flexStart]}>
            <Text numberOfLines={2} style={[styles.itemText,{color:fontColor,fontSize}]}>{this.props.text}</Text>
          </View>
        </TouchFeedback>
      </View>
    )
  }
}

SelectorButton.propTypes = {
  selected: PropTypes.bool,
  text:PropTypes.string,
  style:PropTypes.object,
  onClick:PropTypes.func,
};



var styles = StyleSheet.create({
  item:{
    height:38,
    // marginRight:17,
    borderRadius:2,
    flex:1,

  },
  button:{
    flex:1,
    justifyContent:'center',
    // alignItems:'center',
    overflow:'hidden'
    // backgroundColor:'red'
  },
  itemText:{
    // flex:1
    textAlign:'center'
  },
  flexStart:{
    // justifyContent:"flex-start"
  }
});
