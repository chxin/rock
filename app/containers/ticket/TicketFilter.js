
'use strict';
import React,{Component,PropTypes} from 'react';

import {
  InteractionManager,
  Alert
} from 'react-native';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {filterChanged,filterClosed,resetFilterData,
  filterDidChanged,loadTicketBuildings,filterReadyToSearch} from '../../actions/ticketAction';
import TicketFilterView from '../../components/ticket/TicketFilter';
import TicketFilterResult from './TicketFilterResult';

var dismissKeyboard = require('dismissKeyboard');

class TicketFilter extends Component{
  constructor(props){
    super(props);

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.loadTicketBuildings();
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    this.props.filterClosed();
    backHelper.destroy(this.props.route.id);
  }
  _checkTimeIsTrue()
  {
    var StartTime = this.props.selectDatas.get('ticketStartTime');
    var EndTime = this.props.selectDatas.get('ticketEndTime');
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
  render() {
    return (
      <TicketFilterView
        selectDatas={this.props.selectDatas}
        isFetching={this.props.isFetching}
        arrBuildsName={this.props.arrBuildsName}
        onClose={()=>{
          this.props.navigator.pop()}}
        doFilter={()=>{
          dismissKeyboard();
          if (!this._checkTimeIsTrue()) {
            return;
          }
          this.props.filterReadyToSearch();
          this.props.navigator.push({id:'ticket_filter_result',component:TicketFilterResult});
        }}
        doReset={()=>{
          this.props.resetFilterData();
        }}
        filterChanged={(type,value)=>this.props.filterChanged({type,value})}/>
    );
  }
}

TicketFilter.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  rawCodes:PropTypes.object,
  selectDatas:PropTypes.object,
  isFetching:PropTypes.bool,
  codes:PropTypes.object,
  arrBuildsName:PropTypes.array,
  doFilter:PropTypes.func,
  filterChanged:PropTypes.func,
  filterClosed:PropTypes.func,
  loadTicketBuildings:PropTypes.func,
  filterDidChanged:PropTypes.func,
  resetFilterData:PropTypes.func,
  filterReadyToSearch:PropTypes.func,
}

function mapStateToProps(state) {
  var ticketFilter = state.ticket.ticketFilter;
  var selectDatas = ticketFilter.get('selectDatas');
  var buils = ticketFilter.get('arrBuildsName');
  // console.warn('mapStateToProps...',buils);
  return {
    selectDatas,
    isFetching:ticketFilter.get('isFetching'),
    arrBuildsName:buils.toArray(),
  };
}

export default connect(mapStateToProps,{
  filterChanged,filterClosed,filterDidChanged,resetFilterData,loadTicketBuildings,filterReadyToSearch})(TicketFilter);
