'uset strict'

import React,{Component,PropTypes,NativeModules} from 'react';

import {
  View,
} from 'react-native';
import Camera from 'react-native-camera';
// var CameraManager = NativeModules.CameraManager;
import ViewFinder from './ViewFinder.js';

export default class Scanner extends Component{
  constructor(props){
    super(props);
    // CameraManager.changeOrientation('landscapeLeft');
  }
  render() {
    return (
      <Camera
        style={{flex:1,}}
        onBarCodeRead={this.props.onBarCodeRead}
        orientation="portrait"
        captureAudio={false}
         >

         <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

         </View>
         <View style={{flexDirection:'row',height:200}}>
           <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

           </View>
           <View style={{
               width:200,
             }} >
             <ViewFinder />
           </View>
             <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

             </View>
         </View>

           <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>

           </View>
       </Camera>
    );
  }
}

// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
//
// <View style={{flex:1,flexDirection:'row',}}>
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
// <View style={{
//   width:250,
//  //  height:200,
//   borderColor:'white',
//   borderWidth:1,
// }} />
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>
// </View>
//
// <View style={{flex:1,backgroundColor:'#000000',opacity:0.6,}}>
// </View>

Scanner.propTypes = {
  onBarCodeRead:PropTypes.func.isRequired
}
