
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  Alert,
  BackAndroid,
  ToastAndroid,
  Platform,
  NetInfo,
  Linking,
  AppState,
} from 'react-native';

import { connect } from 'react-redux';

// import backHelper from '../utils/backHelper';
import Scene from '../components/Scene.js';
import Loading from '../components/Loading';
import Main from './Main';
import LoginWithPassword from './LoginWithPassword';
import Trial from './Trial';
import {loadUser,logout} from '../actions/loginAction.js';
import {checkVersion} from '../actions/myAction.js';
import {resetError} from '../actions/errorAction.js';
// import ImagePicker from '../components/ImagePicker.js';
import Toast from 'react-native-root-toast';
import SplashScreen from "rn-splash-screen";
import Orientation from 'react-native-orientation';

import storage from '../utils/storage.js';
import appInfo from '../utils/appInfo.js';

var _exitHandler = null;
var _exitFlag = false;
var mainLoginView=null;

class Entry extends Component{
  constructor(props){
    super(props);
    Orientation.lockToPortrait();
  }
  _hasLogined(){
    return this.props.user.get('hasLogin');
  }
  _readyExitApp(){

    var routes = this.refs.scene.getNavigator().getCurrentRoutes();
    if(routes.length > 1){
      // console.log('routes',this.refs.navigator);
      this.refs.scene.getNavigator().pop();
      return true;
    }
    if(_exitFlag === true){
      if (this.props.user&&this.props.user.get('isDemoUser')) {
        storage.removeToken();
      }
      BackAndroid.exitApp();
      return false;
    }
    _exitFlag = true;
    //exitApp
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    setTimeout(()=>{
      _exitFlag = false;
    },2000);

    return true; //return true to cancel exit
  }
  _showNetworkToast(isConnected){
    var text = '';
    if(!isConnected){
      text = '您的网络出现了问题，可能无法连接到系统';
      this._isConnected = false;
    }
    else {
      if(this._isConnected === false){
        text = '您的网络已恢复';
        this._isConnected = true;
        this._checkCurrentUser();
      }
    }
    if(text){
      Toast.show(text, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
      });
    }

  }
  _checkNetwork(){
    NetInfo.isConnected.fetch();
    // .then((isConnected) => {
    //   // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    //   if(!isConnected){
    //     this._showNetworkToast(isConnected);
    //   }
    //
    //
    // });
    NetInfo.isConnected.addEventListener(
      'change',
      (isConnected)=>this._networkChanged(isConnected)
    );
  }
  _networkChanged(isConnected){
    this._showNetworkToast(isConnected);
  }
  _showUpgradeWebPage(){
    // console.warn('webpage');
    Linking.openURL(this.props.version.get('upgradeUri'));
  }
  _checkCurrentUser(){
    if(!this.props.user.get('user')){
      // console.warn('loadUser');
      this.props.loadUser();
    }
  }
  _handleStateChange(state){
    // console.warn('state',state);
    if(state === 'active'){
      NetInfo.isConnected.fetch();
      // console.warn('_handleStateChange');

      // this._checkCurrentUser();
    }
  }
  componentWillMount() {
    this.props.loadUser();
    // if(Platform.OS === 'android'){
    //   this.props.checkVersion({type:Platform.OS,env:appInfo.get().prod?'prod':'test'});
    // }
    this._checkNetwork();

  }
  componentDidMount() {
    if(Platform.OS !== 'ios'){
      _exitHandler = ()=>this._readyExitApp();
      BackAndroid.addEventListener('hardwareBackPress',_exitHandler);

      // console.warn('hide SplashScreen');
      // Alert.alert('','hide SplashScreen')
      SplashScreen.hide();
    }
    this._handleAppStateChange = (state)=>this._handleStateChange(state);
    AppState.addEventListener('change', this._handleAppStateChange);

  }
  componentWillReceiveProps(nextProps) {
    if(this.props.user.get('user') && !nextProps.user.get('user')){
      console.warn('ready logout');
      this.refs.scene.getNavigator().resetTo({component:LoginWithPassword,navigatorBar:false});
    }

    if(nextProps.error){
      console.warn('next error...',nextProps.error);
      if (nextProps.error==='403') {
        Alert.alert(
          '',
          '登录失效，请重新登录',
          [
            {text: '好', onPress: () =>{
              this.props.resetError();
              this.props.logout();
            }}
          ])
      }else {
        Alert.alert(
          '',
          nextProps.error,
          [
            {text: '好', onPress: () => this.props.resetError()}
          ]
        )
      }

    }
    if (!this.props.user.get('user')&&nextProps.user.get('user')) {
      // console.warn('real user login success...');
      if(Platform.OS === 'android'){
        if (appInfo.get().prod) {
          this.props.checkVersion({type:Platform.OS,env:appInfo.get().prod?'prod':'test'});
        }
      }
    }
    if(!this.props.version.get('hasNewVersion')
          && nextProps.version.get('hasNewVersion')){
            // console.warn('version',this.props.version.toJSON());
      Alert.alert(
        '发现新版本',
        `请更新至变频顾问v${nextProps.version.get('version')}，马上体验！`,
        [
          {text: '取消', onPress: () => {}, style:'cancel'},
          {text: '立即更新', onPress: () => this._showUpgradeWebPage()}
        ]
      )
    }
  }
  componentWillUnmount() {
    if(Platform.OS !== 'ios'){
      BackAndroid.removeEventListener('hardwareBackPress',_exitHandler);

    }
  }
  render() {
    // console.warn('_hasLogined....',this.props.user.get('hasLogin'),this.props.user);
    if(this._hasLogined()===null){
      return (
        <Loading />
      );
    }

    var entry = null


    if(this._hasLogined()){
      // console.warn('Entry main...');
      if (!mainLoginView) {
        entry = {component:Main};
        mainLoginView=entry;
      }else {
        entry=mainLoginView;
      }
      // entry = {component:ImagePicker};
    }
    else {
      entry = {component:LoginWithPassword,navigatorBar:false};
    }

    return (
      <Scene ref="scene" initComponent={entry} />
    );
  }
}

Entry.propTypes = {
  navigator:PropTypes.object,
  version:PropTypes.object,
  user:PropTypes.object.isRequired,
  loadUser:PropTypes.func.isRequired,
  logout:PropTypes.func.isRequired,
  checkVersion:PropTypes.func.isRequired,
  resetError:PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  // console.log('app mapStateToProps');
  // console.warn('mapStateToProps...',state.user);
  return {
    version:state.version,
    user:state.user,
    error:state.error
  }
}

export default connect(mapStateToProps,{loadUser,logout,resetError,checkVersion})(Entry);
