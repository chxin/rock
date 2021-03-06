
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  // PixelRatio,
} from 'react-native';

import Toolbar from '../Toolbar';
import Text from '../Text';
import {GRAY,ALARM_HIGH,ALARM_MIDDLE,ALARM_LOW,BLACK,GREEN} from '../../styles/color';
import moment from 'moment';
import ListSeperator from '../ListSeperator';
import Bottom from '../Bottom'
import Loading from '../Loading';
import Button from '../Button.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import unit from '../../utils/unit.js';
// import num
moment.locale('zh-cn');

export default class AlarmDetail extends Component{
  constructor(props){
    super(props);
  }
  _hasResolved(){
    var hasTime = false;
    if (this.props.rowData) {
      hasTime = !!this.props.rowData.get('SecureTime');
    }
    return !!hasTime;
  }
  _hasProcessed(){
    var status = this.props.rowData.get('Status');
    if(!status) return false;
    return status.size === 0?false:true;
  }
  _getAlarmLevel(){
    var level = this.props.rowData.get('Level');
    if(level === 1){
      return '低';
    }
    else if(level === 2){
      return '中';
    }
    else{
      return '高';
    }
  }
  _getAlarmCode(){
    return this.props.rowData.get('Code');
  }
  _getAlarmTime(){
    // console.warn("AlarmTime",this.props.rowData.get('AlarmTime'));
    // console.log('AlarmTime');
    // console.log(this.props.data.getIn(['data','AlarmTime']));
    var obj = moment(this.props.rowData.get('AlarmTime'));
    return obj.format("HH:mm:ss");
  }
  _getAlarmDate(){
    var obj = moment(this.props.rowData.get('AlarmTime'));
    return obj.format("YYYY年M月D日")
  }
  _getAlarmParameter(){
    return this.props.rowData.get('Parameter');
  }
  _getAlarmActualValue(){
    return this.props.rowData.get('ActualValue');
  }
  _getAlarmThresholdValue(){
    return this.props.rowData.get('ThresholdValue');
  }

  _getBackgroundColor(){
    var hasResolved = this._hasResolved();
    var color = ALARM_HIGH;
    if (!this.props.rowData) {
      color = GRAY;
    }else {
      if(hasResolved){
        color = GRAY;
      }else {
        var level = this.props.rowData.get('Level');
        if(level === 1){
          color = ALARM_LOW;
        }
        else if(level === 2){
          color = ALARM_MIDDLE;
        }
        else{
          color = ALARM_HIGH;
        }
      }
    }
    return color;
  }
  _getHeaderView(){
    var {width} = Dimensions.get('window');
    var height = parseInt(width*2/3)-80;
    // console.warn('width:%s height%s',width,height);
    return (
      <View style={[styles.header, {backgroundColor:this._getBackgroundColor(),height:height}]}>
        <View style={styles.headerLeft}>
          <Text style={styles.datetime}>
            <Text >{this._getAlarmDate()}</Text>
            <Text > </Text>
            <Text style={styles.date}>{this._getAlarmTime()}</Text>
          </Text>
          <Text style={styles.codeText} numberOfLines={2}>{this._getAlarmCode()}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.level}>
              <Text style={styles.levelText}>{this._getAlarmLevel()}</Text>
          </View>
        </View>
      </View>
    );
  }
  _getNavIcon(item){
    if(item.isNav){
      return (
        <Icon type='arrow_right' size={16} color={GRAY} />
      )
    }
  }
  _getPathRows(content){
    if (!content) {
      return(<Text key={0} style={[styles.detailText]} numberOfLines={1}>{''}</Text>);
    }
    return content.split('\n').map((item,index)=>{
      var marginTop = 0;
      if(index !== 0){
        marginTop = 10;
      }
      return(<Text key={index} style={[styles.detailText,{marginTop}]} numberOfLines={1}>{item}</Text>);
    });
  }
  _formatNumber(v,digit){
    if(v.indexOf('.') >= 0){
      return unit.toFixed(Number(v),digit);
    }
    else {
      return v;
    }
  }
  _format(v,type){
    if(isNaN(v)){
      return v;
    }
    if(!type){ // could be null
      return '-';
    }
    if(type.indexOf('功率因数') >= 0){
      return this._formatNumber(v.toString(),2);
    }
    else {
      return this._formatNumber(v.toString(),1);
    }
  }
  _isCode303(rowData)
  {
    return rowData.get('Code')==='故障跳闸';
  }
    // {this._getPathRows(item.content)}
  _getDeviceNameView(rowData){
    var path = rowData.get('DeviceName');
    var list = [
      {title:'资产',content:path,isNav:true},
    ];
    return list.map((item,index)=>{
      return (
        <TouchFeedback style={[{flex:1,backgroundColor:'white'}]} onPress={()=>{
          this.props.onAssetClick(rowData);
        }}>
        <View key={index} style={[styles.detailRow]}>
          <Text style={[styles.detailTitleText]}>{item.title}</Text>
          <View style={{flex:1,justifyContent:'flex-start'}}>
            <Text key={index} style={[styles.detailText]} numberOfLines={1}>{item.content}</Text>
          </View>
          <View style={{justifyContent:'flex-end'}}>
            {this._getNavIcon(item)}
          </View>
        </View>
      </TouchFeedback>
      )
    });
  }
  _formatValue(value)
  {
    if (!value) {
      value='--';
    }else if (value==='无效值') {
      value='--';
    }

    return value;
  }
  _getDetailView(rowData){
    var actualValue = this._format(rowData.get('ActualValue'),rowData.get('Parameter'));
    var uom = rowData.get('Uom') || '';
    var dataText = `${actualValue}${uom}（设定值:${rowData.get('ThresholdValue')}${uom}）`;
    // var path = rowData.get('DeviceName') + '\n';
    var path = rowData.get('Paths').reverse().join('\n');
    path += '\n' + this.props.customerName;
    var list = [
      {title:'位置',content:path},
      {title:'点位',content:rowData.get('Parameter')},
      {title:'数据',content:dataText}//数据
    ];

    if (this._isCode303(rowData)) {
      var reason='';
      var details='';
      rowData.get('TripDetails').forEach((item,index)=>{
        if (item.get('Key')==='故障原因') {
          reason=item.get('Value');
          list.splice(0,0,{title:'原因',content:this._formatValue(reason)});
        }else {
          details+=(item.get('Key')+':'+this._formatValue(item.get('Value')));
          if (index!==rowData.get('TripDetails').size-1) {
            details+='\n';
          }
        }
      });
      if (details) {
        list.splice(1,0,{title:'详情',content:details});
      }
    }
    return list.map((item,index)=>{
      var bottom = 14;
      if (index === (list.length - 1)) {
        bottom = 11;
      }
      return (
        <View key={index} style={[styles.detailRow, {paddingBottom:bottom}]}>
          <View style={{}}>
            <Text style={[styles.detailTitleText]}>{item.title}</Text>
          </View>
          <View style={{flex:1,justifyContent:'flex-start',}}>
            {this._getPathRows(item.content)}
          </View>
        </View>
      )
    });
  }
  _getStatusView(rowData){
    var statusList= rowData.get('Status') || [];
    var ticketLink = null;
    if(rowData.get('TicketId')){
      ticketLink = (
        <Text onPress={this.props.viewTicket} style={styles.viewTicket}>查看工单</Text>
      );
    }
    var list = statusList.reverse();
    var lastOne = null;
    list.forEach((item)=>{
      if(item.get('User') !== 'self'){
        if(lastOne){
          if(lastOne.get('Timestamp') < item.get('Timestamp')){
            lastOne = item;
          }
        }
        else {
          lastOne = item;
        }
      }
    })
    // console.warn('lastOne',statusList);
    return list.map((item,index)=>{
      var time = moment.utc(item.get('Timestamp')).format('YYYY-MM-DD  HH:mm:ss');
      return (
        <View key={index} style={styles.statusRow}>
          <Text style={styles.statusTimeText}>{time}</Text>
          <View style={styles.statusRowContainer}>
            <Text style={styles.statusText} numberOfLines={1}>{item.get('Content')}</Text>
          </View>
          {(lastOne === item) ? ticketLink : null}
        </View>
      )
    });
  }
  _getBottomButton(){
    if(this.props.rowData.get('TicketId') || !privilegeHelper.hasAuth('TicketEditPrivilegeCode')){
      return null;
    }
    return (
      <Bottom height={72}>
        <Button
          style={[styles.button,{
            backgroundColor:GREEN,
          }]}
          textStyle={{
            fontSize:15,
            color:'#ffffff'
          }}
          text='创建报警工单' onClick={()=>this.props.createOrEditTicket(this.props.rowData)} />
      </Bottom>
    );
  }
  _getContent(){
    if(!this.props.rowData){
      var loading = null;
      if(this.props.isFetching){
        loading = (
          <Loading />
        );
      }
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          {
            loading
          }
        </View>
      )
    }else {
      var button = this._getBottomButton();
      var marginBottom = 0;
      if(button){
        marginBottom = 72;
      }
      return(
        <View style={{flex:1}}>
          <ScrollView style={[styles.wrapper,{marginBottom}]}>
            <View style={styles.container}>
              {this._getHeaderView()}
              <View style={{padding:16,flex:1,backgroundColor:'white'}}>
                {this._getDeviceNameView(this.props.rowData)}
                <View style={{paddingVertical:10}}>
                  <ListSeperator />
                </View>
                {this._getDetailView(this.props.rowData)}
                <View style={{paddingBottom:16}}>
                  <ListSeperator />
                </View>
                {this._getStatusView(this.props.rowData)}
              </View>
            </View>
          </ScrollView>
          {this._getBottomButton()}
        </View>
      );
    }
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:this._getBackgroundColor()}}>
        <Toolbar
          title='报警详情'
          titleColor='white'
          tintColor='white'
          color='transparent'
          navIcon="back"
          onIconClicked={()=>this.props.onBack()} />
        {this._getContent()}
      </View>
    );
  }
}

AlarmDetail.propTypes = {
  onBack:PropTypes.func,
  createOrEditTicket:PropTypes.func,
  viewTicket:PropTypes.func,
  isFetching:PropTypes.bool,
  rowData:PropTypes.object,//immutable
  customerName:PropTypes.string,
  onAssetClick:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header:{
    // flex:1,//make header too height
    paddingTop:24,
    paddingLeft:16,
    paddingRight:16,
    flexDirection:'row'
  },
  title:{
    fontSize:17,
    color:'white'
  },
  headerLeft:{
    flex:1,
    justifyContent:'flex-end',
    paddingBottom:25,
    // backgroundColor:'black'//test
  },
  headerRight:{
    width:80,
    paddingBottom:25,
    alignItems:'flex-end',
    justifyContent:'flex-end',
    // backgroundColor:'#00ff00'//test
  },
  datetime:{
    fontSize: 14,
    marginBottom:18,
    color:'white',
  },
  codeText:{
    fontSize: 32,
    color:'white',
    // backgroundColor:'red',//test
  },
  level:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:35,
    width:70,
    height:70,
    justifyContent:'center',
    alignItems:'center'
  },
  levelText:{
    fontSize: 20,
    color:'white'
  },
  detailRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-between',
  },
  detailTitleText:{
    color:GRAY,
    fontSize:14,
    // height:17,
  },
  detailText:{
    color:BLACK,
    fontSize:14,
    marginLeft:10,
    // height:17,
    // lineHeight:25,
    // backgroundColor:'red',
  },
  statusRowContainer:{
    flex:1,
  },
  statusRow:{
    flexDirection:'row',
    marginBottom:11
  },
  statusTimeText:{
    color:GRAY,
    fontSize:12,
  },
  statusText:{
    color:GRAY,
    fontSize:12,
    marginLeft:21
  },
  viewTicket:{
    color:GREEN,
    fontSize:12,
  },
  wrapper:{
    // paddingBottom: 48,
    flex:1,
    backgroundColor:'white',
  },
  button:{
    height:48,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  }
});
