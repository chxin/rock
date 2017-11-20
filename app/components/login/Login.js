'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';

import Icon from '../Icon';
import Form from './Form';
import KeyboardSpacer from '../KeyboardSpacer';
import {BLACK} from '../../styles/color.js';
import Text from '../Text.js';
import TouchFeedback from '../TouchFeedback';
var dismissKeyboard = require('dismissKeyboard');

export default class Login extends Component{
  constructor(props){
    super(props);
    var {width,height} = Dimensions.get('window');
    // console.warn('width,height',width,height);
    this.state = {width,height}
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.data === nextProps.data ){
      return false;
    }
    return true;
  }
  render(){
    var {width,height} = this.state;
    var {type} = this.props,text;
    if(type === 'mobile'){
      text = '用户名密码登录';
    }
    else {
      text = '手机验证码登录';
    }
    var hBottomHeight=69;
    var bkgYPosi=height-hBottomHeight;
    // console.warn('ddd',width,hBottomHeight);
    return (
      <TouchableOpacity activeOpacity={1.0} onPress={() => dismissKeyboard()}>
        <Image
          source={require('../../images/app_bkg/app_bkg.jpg')}
          resizeMode="cover"
          style={[{width,height},styles.imageBackground]}>
          <View style={styles.form}>
            <Form
              type={this.props.type}
              data={this.props.data}
              onSend={this.props.onSend}
              onSubmit={this.props.onSubmit}
              onInputChanged={this.props.onInputChanged}  />
          </View>
          <View style={{position:'absolute',top:bkgYPosi,backgroundColor:'#3DCD58',width,height:hBottomHeight,alignItems:'flex-end',justifyContent:'center',
            }}>
            <Image
              source={require('../../images/app_bottom_logo/login_bottom_logo.png')}
              resizeMode="contain"
              style={[styles.imageBackground,{height:38,width:177,marginRight:8}]}
              >
            </Image>
          </View>
        </Image>
      </TouchableOpacity>
    )
  }
}

// <TouchFeedback style={{height:40,}} onPress={()=>{this.props.onSwitch();
//   dismissKeyboard()}}>
//   <View style={{alignItems:'center',justifyContent:'center',}}>
//     <View style={{marginTop:24,width:94,height:22,alignItems:'center',borderBottomWidth:1,borderColor:'white'}}>
//       <Text style={styles.switcherText}>{text}</Text>
//     </View>
//   </View>
// </TouchFeedback>

Login.propTypes = {
  type:PropTypes.string.isRequired,
  onSwitch:PropTypes.func.isRequired,
  onBack:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired,
  onInputChanged:PropTypes.func.isRequired,
  onSend:PropTypes.func,
  data:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  imageBackground:{
    // flex:1,
    justifyContent:'center',
  },
  switcherText:{
    fontSize:12,
    color:'white',
    // textDecorationLine:'underline',
  },
  switcher:{
    marginTop:24,
    height:50,
    // flex:1,
    position:'absolute',
    top:0,
    left:10,
    right:0,
    // backgroundColor:'red',
    justifyContent:'center',
  },
  form:{
    flex:1,
    marginTop:110,
    // paddingHorizontal:16,
    // backgroundColor:'red',
    // justifyContent:'center',
    // alignItems:'center'
  }
});
