'use strict'
import React,{Component,PropTypes} from 'react';

import {View,} from 'react-native';
import Text from '../Text.js';
import {BLACK,GREEN} from '../../styles/color.js';
import TouchFeedback from '../TouchFeedback';
export default class MoreContent extends Component {
  constructor(props){
    super(props);
    var needMoreButton = false;
    var lines = props.content.split('\n');
    if(lines.length > 3){
      needMoreButton = true;
    }
    this.state = {needMoreButton,lines:3};
    // console.warn(props.title,needMoreButton,props.content.length);
  }
  _checkHeight(e){
    if(!this.state.lines) return;

    var {nativeEvent:{layout:{height}}} = e;
    if(height > 48){
      if(!this.state.needMoreButton){
        this.setState({needMoreButton:true});
      }
    }
  }
  _getMoreButton(){
    if(this.state.needMoreButton){
      return (
        <View style={{flex:1,
            alignItems:'flex-end',
            position:'absolute',bottom:-20,right:-20,height:44,width:100,
          }}>
          <TouchFeedback onPress={()=>{
              this.setState({lines:null,needMoreButton:false})
            }} style={{flex:1,width:100,}} >
            <View style={{flex:1,marginBottom:8,marginRight:20,justifyContent:'flex-end',alignItems:'flex-end'}}>
              <Text style={{fontSize:12,color:GREEN}}>{'更多'}
              </Text>
            </View>

          </TouchFeedback>
        </View>

      );
    }
    return null;
  }
  render () {
    var {content,title} = this.props;

    // var {width} = Dimensions.get('window');
    // var lineCount = 1, chars = width - ;
    // lines.forEach((item)=>{
    //   if(item.length >
    // });
    var marginBottom = 0;
    if(this.state.needMoreButton){
      marginBottom = 6;
    }
    return (
      <View style={this.props.style}>
        <Text style={{fontSize:17,color:BLACK}}>{title}</Text>
        <View style={{flex:1,marginTop:17,marginBottom,position:'relative'}}>
          <Text
            style={{fontSize:12,color:BLACK,lineHeight:16}}
            numberOfLines={this.state.lines}
            onLayout={(e)=>{this._checkHeight(e)}}>{content}</Text>
          {this._getMoreButton()}
        </View>
      </View>
    )
  }
}

MoreContent.propTypes = {
  title:PropTypes.string.isRequired,
  content:PropTypes.string.isRequired,
  style:View.propTypes.style
}
