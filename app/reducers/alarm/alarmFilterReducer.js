'use strict';


import {
  ALARM_FILTER_CHANGED,
  ALARM_FILTER_DIDCHANGED,
  ALARM_FIRSTPAGE,
  ALARM_NEXTPAGE,
  ALARM_CODE_REQUEST,
  ALARM_CODE_SUCCESS,
  ALARM_BUILDING_SUCCESS,
  ALARM_BUILDING_FAILURE,
  ALARM_FILTER_CLEAR_RESULT,
  ALARM_FILTER_CLOSED,
  ALARM_FILTER_REMOVE_BUILDING_DATA,
  ALARM_FILTER_PARAM_RESET,
  // ALARM_LOAD_SUCCESS
} from '../../actions/alarmAction';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import {compose} from 'redux';
import Immutable from 'immutable';
import moment from 'moment';
moment.locale('zh-cn');

var today = moment();
var lastMonth=moment(today).subtract(1,'M').format('YYYY-MM-DD');
var nextMonth=moment(today).format('YYYY-MM-DD');

var defaultState = Immutable.fromJS({
    hasFilter:false,
    isFetching:false,

    codes:null,
    buildings:null,
    filterBuildings:[],
    filterCodes: ['故障跳闸','长延时脱扣',
                      '短延时脱扣','瞬动脱扣','接地故障','漏电保护','其他类别'],
    stable:{
      CurrentPage:1,
      ItemsPerPage:20,
      IsSecure:null,
      StartTime:null,
      EndTime:null,
      Level:[],
      HierarchyIds:null,
      IsCriteriaSearch:false,
      SortMode:{
        Field:'AlarmTime',
        IsDesc:true
      }
    },
    temp:{
      StartTime:lastMonth,
      EndTime:nextMonth,
      status:[],
      level:[],
      code:[],
      building:[]
    },
    temp1:{
      StartTime:lastMonth,
      EndTime:nextMonth,
      status:[],
      level:[],
      code:[],
      building:[]
    },
});



function mergeTempFilter(state,action) {
  var newState = state;

  var temp = newState.get('temp');
  var {type,value} = action.data;
  if (type==='StartTime'||type==='EndTime') {
    var strDate = moment(value).format('YYYY-MM-DD');
    temp = temp.set(type,strDate);
  }else {
    var typeValue = temp.get(type);
    var index = typeValue.findIndex((item)=> item === value);
    if(index < 0){
      typeValue=typeValue.unshift(value);
    }else {
      typeValue=typeValue.remove(index);
    }
    temp = temp.set(type,typeValue);

    // console.warn('mergeTempFilter...',type,value,typeValue);
  }
  return newState.set('temp',temp);
}


function convertStatus(state) {
  var status = state.getIn(['temp','status']);
  var isSecure=null;
  if (status.includes(1)&&status.includes(0)) {
    isSecure=null;
  }else if (status.includes(1)) {
    isSecure=true;
  }else if (status.includes(0)) {
    isSecure=false;
  }

  return state.setIn(['stable','IsSecure'],isSecure);
}

function convertDates(state) {
  return state.setIn(['stable','StartTime'],state.getIn(['temp','StartTime']))
  .setIn(['stable','EndTime'],state.getIn(['temp','EndTime']));
}

function convertLevel(state) {
  // console.warn('convertLevel',state.get('temp'));
  var level = state.getIn(['temp','level']);
  // 在界面上全部，高，中低对应0，1，2，但是后台对应为3，2，1
  var newLevel=[];
  level.forEach((item)=>{
    if (item===0) {
      newLevel.push(3);
    }else if (item===1) {
      newLevel.push(2);
    }else if (item===2) {
      newLevel.push(1);
    }
  });

  return state.setIn(['stable','Level'],Immutable.List(newLevel));
}

function convertClass(state) {
  var code = state.getIn(['temp','code']);
  var newCode = mappingAlarmCode(state,code);
  return state.setIn(['stable','AlarmCode'],newCode);
}

function convertBuilding(state) {
  var building = state.getIn(['temp','building']);//index of buildings
  var newBuilding = mappingAlarmBuilding(state,building);
  console.warn('convertBuilding...',newBuilding);
  return state.setIn(['stable','HierarchyIds'],newBuilding);
}

function mergeStableFilter(state,action) {
  console.warn('mergeStableFilter...',action);
  var newState = compose(convertBuilding,convertClass,convertLevel,convertStatus,convertDates)(state);
  newState = newState.setIn(['stable','CurrentPage'],1);
  newState = newState.set('temp1',Immutable.fromJS(newState.get('temp').toJSON()));

  newState = newState.setIn(['stable','IsCriteriaSearch'],true);
  return newState.set('hasFilter',true);
}

function mappingAlarmCode(state,arrIndex) {
  if(!arrIndex) return null;
  var filterCodes = state.get('filterCodes');
  var arrCodes=[];
  arrIndex.forEach((index)=>{
    var text = filterCodes.get(index);
    var result = state.get('codes').find((item)=>{
      return item.get('Type').indexOf(text) >= 0;
    });
    if(result){
      arrCodes.push(result.get('Code'));
    }
  });
  var arrOtherCodes=null;
  if (arrIndex.includes(6)) {
    arrOtherCodes=state.get('codes').filterNot((item) => {
      return filterCodes.includes(item.get('Type'))
    }).map((item)=> item.get('Code'));
  }
  // console.warn(
  //   'mappingAlarmCode...',arrCodes,arrOtherCodes.toArray()
  // );
  if (arrOtherCodes) {
    arrCodes.push(arrOtherCodes.toArray());
  }
  var strCodes=arrCodes.map((item)=> item).join(',');
  return strCodes;
}

function mappingAlarmBuilding(state,arrIndex) {
  if(!arrIndex) return null;
  var arrBuilds=[];
  arrIndex.forEach((index)=>{
    var result=state.get('buildings').get(index);
    arrBuilds.push(result.get('id'));
  });
  // var strCodes=arrBuilds.map((item)=> item).join(',');
  return arrBuilds;
}

function nextPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('CurrentPage',stable.get('CurrentPage')+1);
  return state.set('stable',stable);
}

function firstPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('CurrentPage',1);

  return state.set('stable',stable);
}

function clearFilter(state,action) {
  return defaultState;
}

function filterClosed(state,action) {
  var newState = state;
  if(newState.get('temp1')){
    newState = newState.set('temp',newState.get('temp1'));
  }

  return newState;
}

function mergeAlarmCode(state,action) {
  var result = action.response.Result;
  var newState = state.set('codes',Immutable.fromJS(result));

  if(newState.get('buildings')&&newState.get('buildings').size >= 0){
    return newState.set('isFetching',false);
  }

  return newState;
}

function mergeAlarmBuilding(state,action) {
  var result = action.response.Result;

  // console.log(result);

  result = result.map((item)=>{
    return {
      id:item.Id,
      name:item.Name
    }
  });

  var newState = state.set('buildings',Immutable.fromJS(result));
  // console.warn('mergeAlarmBuilding...',newState.get('buildings'),newState.get('codes'));

  newState = newState.set('filterBuildings',
          Immutable.fromJS(result.map((item)=>{
            return item.name
          })));


  if(newState.get('codes') && newState.get('codes').size >= 0){
    return newState.set('isFetching',false);
  }

  return newState;
}

function resetBuildingData(state,action) {
  return state.set('buildings',[]).set('codes',null);
}

function resetCurrentAlarmFilterParam(state,action) {
  // state.getIn(['temp','status']);
  var arr=Immutable.fromJS([]);
  return state.setIn(['temp','status'],arr)
  .setIn(['temp','level'],arr)
  .setIn(['temp','code'],arr)
  .setIn(['temp','building'],arr)
  .setIn(['temp','StartTime'],lastMonth)
  .setIn(['temp','EndTime'],nextMonth)
  ;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = null;// '您没有这一项的操作权限，请联系系统管理员';
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case ALARM_FILTER_CHANGED:
      return mergeTempFilter(state,action);
    case ALARM_FILTER_DIDCHANGED:
      return mergeStableFilter(state,action);
    case ALARM_FILTER_CLEAR_RESULT:
      return clearFilter(state,action);
    case ALARM_NEXTPAGE:
      return nextPage(state,action);
    case ALARM_FIRSTPAGE:
      return firstPage(state,action);
    case ALARM_CODE_REQUEST:
      return state.set('isFetching',true);
    case ALARM_FILTER_CLOSED:
      return filterClosed(state,action);
    case ALARM_FILTER_PARAM_RESET:
      return resetCurrentAlarmFilterParam(state,action);
    case ALARM_CODE_SUCCESS:
      return mergeAlarmCode(state,action);
    case ALARM_BUILDING_SUCCESS:
      return mergeAlarmBuilding(state,action);
    case ALARM_BUILDING_FAILURE:
      return handleError(state,action);
    case ALARM_FILTER_REMOVE_BUILDING_DATA:
      return resetBuildingData(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
