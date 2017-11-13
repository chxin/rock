'use strict'

import React,{Component,PropTypes} from 'react';

import {View,StyleSheet} from 'react-native';
import TouchFeedback from './TouchFeedback';
import Text from './Text';
import {GREEN,GRAY,TAB_BORDER} from '../styles/color.js';


export default class PagerBar extends Component {
  constructor(props){
    super(props);
  }
  render () {
    var {array,currentIndex,barStyle} = this.props;
    return (
      <View style={[styles.bar,barStyle]}>
        {
          array.map((item,index)=>{
            var lineColor = 'transparent';
            var textColor = GRAY;
            if(index === currentIndex){
              lineColor = GREEN;
              textColor = GREEN;
            }
            return (
              <View key={index} style={styles.barItem}>
                <TouchFeedback onPress={()=>{this.props.onClick(index)}}>
                  <View style={{justifyContent:'space-between'}}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                      <Text style={[styles.barItemText,{color:textColor}]}>{item}</Text>
                    </View>
                    <View style={[styles.barItemLine,{backgroundColor:lineColor}]} />
                  </View>
                </TouchFeedback>
              </View>
            )
          })
        }
      </View>
    )

  }
}

PagerBar.propTypes = {
  array:PropTypes.array.isRequired,
  currentIndex:PropTypes.number.isRequired,
  onClick:PropTypes.func.isRequired,
  barStyle:View.propTypes.style,
};

var styles = StyleSheet.create({
  bar:{
    flexDirection:'row',
    height:38,
    alignItems:'center',
    backgroundColor:'white',
  },
  barItem:{
    flex:1,
    paddingHorizontal:6,
    marginTop:8,
  },
  barItemText:{
    // flex:1,
    textAlign:'center',
    fontSize:14,
    // color:GREEN
  },
  barItemLine:{
    height:2,
    borderRadius:2,
    marginTop:6,
    marginBottom:0,
    marginHorizontal:8
  },
})
