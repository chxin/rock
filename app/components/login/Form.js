'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import Text from '../Text.js';
import Button from '../Button';
import {GRAY,BLACK,GREEN,LOGIN_SEP,LOGIN_GREEN_DISABLED} from '../../styles/color.js';

export default class Form extends Component{
  constructor(props){
    super(props);
    // this.state = {focus:false};
    // this.state = {value1:'',value2:'',submitStatus:'disabled',resendStatus:'disabled'};
  }
  _codeChanged(type,text){
    this.props.onInputChanged(type,text);
  }
  _getTitle(){
    return (
      <View style={{marginBottom:18,marginLeft:0}}>
        <Text style={{color:'white',fontSize:32,fontWeight:'600'}}>{'变频顾问'}</Text>
        <Text style={{marginTop:12,color:'white',fontSize:20}}>{'数字化变频服务顾问'}</Text>
      </View>
    )
  }
  _getMobileValidationForm(){
    var senderEnable = this.props.data.get('senderEnable');
    var counterText = this.props.data.get('counter');
    if(counterText){
      counterText += 's';
    }
    else {
      counterText = '获取';
    }

    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
              ref={(input)=>this._firstInput=input}
              style={styles.input}
              keyboardType={"numeric"}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'bottom'}
              placeholder={'手机号'}
              onChangeText={(text)=>this._codeChanged('phoneNumber',text)}
              value={this.props.data.get('phoneNumber')}
            />
        </View>
        <View style={{height:12,backgroundColor:'transparent'}} />
        <View style={styles.inputContainer}>
          <TextInput
              ref={(input)=>this._secondInput=input}
              style={styles.input}
              keyboardType={"numeric"}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'bottom'}
              placeholder={"验证码"}
              onChangeText={(text)=>this._codeChanged('validCode',text)}
              value={this.props.data.get('validCode')}
            />
          <Button
            text={counterText}
            textStyle={styles.sendButtonText}
            disabledTextStyle={[styles.sendButtonText,styles.sendButtonDisableText]}
            disabledStyle={[styles.sendButton,styles.sendButtonDisable]}
            style={styles.sendButton}
            onClick={()=>this.props.onSend()}
            disabled={!senderEnable} />
        </View>
      </View>

    );
  }
  _getPasswordValidationForm(){
    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
              ref={(input)=>this._firstInput=input}
              style={styles.input}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'bottom'}
              placeholder={"账户"}
              onChangeText={(text)=>this._codeChanged('userName',text)}
              value={this.props.data.get('userName')}
            />
        </View>
        <View style={{height:12,backgroundColor:'transparent'}} />
        <View style={styles.inputContainer}>
          <TextInput
              ref={(input)=>this._secondInput=input}
              style={styles.input}
              secureTextEntry={true}
              underlineColorAndroid={'transparent'}
              textAlign={'left'}
              placeholderTextColor="lightgray"
              textAlignVertical={'bottom'}
              placeholder={"密码"}
              onChangeText={(text)=>this._codeChanged("password",text)}
              value={this.props.data.get('password')}
            />
        </View>
      </View>

    );
  }
  _getLoginButton(){
    var submitEnable = this.props.data.get('submitEnable');

    var text = '登录';
    if(this.props.data.get('isFetching')){
      text = '登录中...';
    }

    return (
      <Button
        text={text}
        style={styles.button}
        disabledStyle={[styles.button,styles.buttonDisabled]}
        disabledTextStyle={[styles.buttonText,styles.buttonDisabledText]}
        textStyle={styles.buttonText}
        onClick={this.props.onSubmit}
        disabled={!submitEnable} />
    )

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // console.warn('mounted');
      // this._firstInput.blur();
      // this._firstInput.focus();
    });
  }
  componentWillUnmount() {
    // this._firstInput.blur();
    // this._secondInput.blur();
  }
  render(){
    var content = null, {type} = this.props;
    if(type === 'mobile'){
      content = this._getMobileValidationForm();
    }
    else{
      content = this._getPasswordValidationForm();
    }


    return (
      <View style={{paddingHorizontal:16,}}>
        {this._getTitle()}
        {content}
        {this._getLoginButton()}
      </View>
    )
  }
}

Form.propTypes = {
  type:PropTypes.string.isRequired,
  onSubmit:PropTypes.func.isRequired,
  onSend:PropTypes.func,
  data:PropTypes.object.isRequired,
  onInputChanged:PropTypes.func.isRequired
}


var styles = StyleSheet.create({
  form:{
    backgroundColor:'transparent',
    // borderRadius:6,
    // paddingHorizontal:10,

  },
  inputContainer:{
    backgroundColor:'white',
    height:41,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  inputLabel:{
    color:'black',
    fontSize:14,
    width:64,
    textAlign:'center'
  },
  input:{
    flex:1,
    fontSize:14,
    marginLeft:12,
    backgroundColor:'white',
    marginTop:0,marginBottom:0,
    // height:48,
  },
  sendButton:{
    backgroundColor:GREEN,
    width:72,
    height:33,
    borderRadius:2,
    marginRight:4,
  },
  sendButtonDisable:{
    backgroundColor:'#bdbdbd'
  },
  sendButtonText:{
    fontSize:20,
    color:'#f0f0f0'
  },
  sendButtonDisableText:{
    color:'#f0f0f0'
  },
  button:{
    marginTop:12,
    backgroundColor:GREEN,
    // flex:1,
    // borderRadius:6,
    height:40,
  },
  buttonDisabled:{
    backgroundColor:LOGIN_GREEN_DISABLED
  },
  buttonText:{
    color:'white',
    fontSize:20
  },
  buttonDisabledText:{
    color:'#bcbcbc',
  }
});
