
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  Alert,
  InteractionManager,
} from 'react-native';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadCreateTicketData,loadTicketById,ticketCreateConditionChange,
          createTicket,resetCreateTicket,updateUserSelectInfo,updateAssetsSelectInfo,deleteTicket} from '../../actions/ticketAction';
import CreateTicketView from '../../components/ticket/CreateTicketView';
import TicketTaskDesEdit from './TicketTaskDesEdit';
import UsersSelect from './UsersSelect';
import AssetsSelect from './AssetsSelect';

class CreateTicket extends Component{
  static contextTypes = {
    showSpinner: React.PropTypes.func,
    hideHud: React.PropTypes.func
  }
  constructor(props){
    super(props);
  }
  _loadContentById(customer){
    if (!this.props.ticketInfo) {
      if (!this.props.alarm) {
        this.props.loadCreateTicketData({'type':'createNormalTicket','value':{customer,alarm:this.props.alarm}});
      }else {
        this.props.loadCreateTicketData({'type':'createAlarmTicket','value':{customer,alarm:this.props.alarm}});
      }
    }else {
      this.props.loadCreateTicketData({'type':'editNormalTicket','value':{customer,ticket:this.props.ticketInfo}});
    }
  }
  _onChangeTicketType(type,value)
  {
    this.props.ticketCreateConditionChange({
      type,
      value
    });
  }
  _gotoDetail(type){
    if (type === 'Content') {
      this.props.navigator.push({
        id:'ticket_description',
        component:TicketTaskDesEdit,
        passProps:{
          content:this.props.data.get('Content'),
          title:'任务描述',
        }
      });
    }
    else if (type === 'Executors') {
      this.props.updateUserSelectInfo({type:'init',value:this.props.selectUsers});
      this.props.navigator.push({
        id:'ticket_users',
        component:UsersSelect,
        passProps:{
          customerId:this.props.customer.get('CustomerId'),
          startTime:this.props.data.get('StartTime'),
          endTime:this.props.data.get('EndTime'),
          selectAssets:this.props.selectAssets,
          title:'执行人',
        }
      });
      // console.warn('this.props.selectUsers',this.props.selectUsers);
    }else if (type === 'Assets') {
      if (!this._checkTimeIsTrue()) {
        return;
      }
      this.props.updateUserSelectInfo({type:'init',value:this.props.selectUsers});
      this.props.navigator.push({
        id:'ticket_assets',
        component:AssetsSelect,
        passProps:{
          customerId:this.props.customer.get('CustomerId'),
          startTime:this.props.data.get('StartTime'),
          endTime:this.props.data.get('EndTime'),
          title:'资产范围',
        }
      });
      this.props.updateAssetsSelectInfo({type:'assetInit',value:this.props.selectAssets});
    }
  }
  _onDateChanged(type,value)
  {
    this.props.ticketCreateConditionChange({
      type,value
    });
  }
  _onRefresh(){
  }

  _onBackClick(){
    this.props.navigator.pop();
  }
  _checkTimeIsTrue()
  {
    var StartTime = this.props.data.get('StartTime');
    var EndTime = this.props.data.get('EndTime');
    if(StartTime > EndTime){
      Alert.alert(
        '',
        '开始时间不能晚于结束时间',
        [
          {text: '好', onPress: () => console.log('Cancel Pressed')}
        ]
      )
      return false;
    }
    return true;
  }
  _onCreateTicket()
  {
    if (!this._checkTimeIsTrue()) {
      return;
    }
    console.warn('asdfasdf');
    this.context.showSpinner();

    var selectAssets=this.props.data.get('selectAssets');
    var selectUsers=this.props.data.get('selectUsers');
    var Assets=[];
    selectAssets.forEach((item)=>{
      Assets.push({'HierarchyId':item.get('Id')});
    });
    var Executors=[];
    selectUsers.forEach((item)=>{
      Executors.push({'UserId':item.get('Id')});
    });
    var reqbody = {
      CustomerId:this.props.data.get('CustomerId'),
      TicketType:this.props.data.get('TicketType'),
      Assets:Assets,
      StartTime:this.props.data.get('StartTime'),
      EndTime:this.props.data.get('EndTime'),
      Executors:Executors,
      Content:this.props.data.get('Content'),
    };
    if (this.props.alarm) {
      reqbody.AlarmId=this.props.alarm.get('Id');
    }
    if (this.props.ticketInfo && this.props.ticketInfo.get('Id')) {
      reqbody.Id=this.props.ticketInfo.get('Id');
    }
    this.props.createTicket(reqbody,!this.props.ticketInfo);
  }
  _onDeleteTicket(){
    var {ticketInfo} = this.props;
    var alertText = '工单'+'"'+ticketInfo.get('TicketNum')+'"'+'将被删除?';
    Alert.alert(
      '',
      alertText,
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '删除', onPress: () => {

          this.props.deleteTicket(ticketInfo.get('Id'));
          this.props.onPostingCallback('delete');
        }}
      ]
    )

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadContentById(this.props.customer);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isPosting===2 && this.props.isPosting===1) {
      // console.warn('hideHud 1');
      this.context.hideHud();
      // console.warn('ticketCreate edit componentWillReceiveProps...',this.props.isFetching,this.props.isPosting,this.props.isEnableCreate);
      this.props.onPostingCallback(this.props.ticketInfo?'edit':'create');
      return ;
    }
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.resetCreateTicket();
  }

  render() {
    return (
      <CreateTicketView
        title={this.props.ticketInfo?'编辑工单':'创建工单'}
        customer={this.props.customer}
        ticketInfo={this.props.ticketInfo}
        onBack={()=>this._onBackClick()}
        isEnableCreate={this.props.isEnableCreate}
        isAlarm={!!this.props.alarm||(this.props.ticketInfo&&this.props.ticketInfo.get('TicketType')===2)}
        isPosting={this.props.isPosting}
        data={this.props.data}
        onRefresh={()=>this._onRefresh()}
        onCreateTicket={()=>this._onCreateTicket()}
        onDeleteTicket={()=>this._onDeleteTicket()}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}
        onDateChanged={(type,value)=>this._onDateChanged(type,value)}
        onTicketTypeSelect={(type,value)=>this._onChangeTicketType(type,value)}/>
    );
  }
}

CreateTicket.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  customer:PropTypes.object,
  alarm:PropTypes.object,
  data:PropTypes.object,
  ticketInfo:PropTypes.object,
  onPostingCallback:PropTypes.func,
  loadCreateTicketData:PropTypes.func,
  loadTicketById:PropTypes.func,
  ticketCreateConditionChange:PropTypes.func,
  updateUserSelectInfo:PropTypes.func,
  deleteTicket:PropTypes.func,
  updateAssetsSelectInfo:PropTypes.func,
  createTicket:PropTypes.func,
  resetCreateTicket:PropTypes.func,
  isFetching:PropTypes.bool,
  isPosting:PropTypes.number,
  isEnableCreate:PropTypes.bool,
  selectUsers:PropTypes.object,
  selectAssets:PropTypes.object,
  // reqBody:PropTypes.any,
}

function mapStateToProps(state,ownProps) {
  var ticketCreate = state.ticket.ticketCreate,
      isFetching = ticketCreate.get('isFetching'),
      isPosting = ticketCreate.get('isPosting'),
      selectUsers = ticketCreate.get('selectUsers'),
      selectAssets = ticketCreate.get('selectAssets'),
      startTime = ticketCreate.get('StartTime'),
      endTime = ticketCreate.get('EndTime'),
      content = ticketCreate.get('Content'),
      ticketType = ticketCreate.get('TicketType');
  var customer = ownProps.customer;
  var alarm = ownProps.alarm;
  var ticketInfo = ownProps.ticketInfo;
  var data = ticketCreate;
  // console.warn('mapStateToProps...',startTime,endTime);
  if (ownProps.customer.get('CustomerId') !== data.get('CustomerId')) {
    data = null;
  }

  var isEnableCreate = customer && ticketType!==0 && selectAssets.size>=1 && startTime && endTime && selectUsers.size>=1 && content.length>0;
  // console.warn('mapStateToProps',data);
  return {
    data,
    isFetching,
    isPosting,
    isEnableCreate,
    selectUsers,
    selectAssets,
    customer,
    alarm,
    ticketInfo,
  };
}

export default connect(mapStateToProps,{
  loadCreateTicketData,loadTicketById,ticketCreateConditionChange,
  createTicket,resetCreateTicket,updateUserSelectInfo,updateAssetsSelectInfo,deleteTicket})(CreateTicket);
