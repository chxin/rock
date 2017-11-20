
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';

import Toolbar from '../Toolbar';

import StatableSelectorGroup from '../alarm/StatableSelectorGroup';
import StatableInputGroup from './StatableInputGroup';
import DateInputGroup from './DateInputGroup';
import {GREEN,LIST_BG,GRAY} from '../../styles/color.js';
import Loading from '../Loading';
import Button from '../Button.js';
import Bottom from '../Bottom.js';

export default class TicketFilter extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([0,1,2,3,4])};
  }
  _renderSeparator(sectionId,rowId){
    return (
      <View key={rowId} style={styles.sepView}></View>
    )
  }
  _renderRow(rowData){
    if(rowData === 0){
      return (
        <DateInputGroup
          title='时间'
          startTime={this.props.selectDatas.get('ticketStartTime')}
          endTime={this.props.selectDatas.get('ticketEndTime')}
          onChanged={(type,text)=>this.props.filterChanged(type,text)} />
      );
    }else if(rowData === 1){
      return (
        <StatableInputGroup
          title='工单ID'
          text={this.props.selectDatas.get('ticketStrId')}
          onChanged={(text)=>this.props.filterChanged('ticketStrId',text)} />
      );
    }
    else if(rowData === 2){
      return (
        <StatableSelectorGroup
          title='状态'
          data={['未开始','执行中','已完成','逾期']}
          selectedIndexes={this.props.selectDatas.get('ticketStatus')}
          onChanged={(index)=>this.props.filterChanged('status',index)} />
      );
    }
    else if(rowData === 3){
      return (
        <StatableSelectorGroup
          title='类型'
          data={['计划工单','报警工单','现场工单','随工工单']}
          selectedIndexes={this.props.selectDatas.get('ticketTypes')}
          onChanged={(index)=>this.props.filterChanged('types',index)} />
      );
    }
    else if(rowData === 4){
      if (!this.props.arrBuildsName || this.props.arrBuildsName.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title='建筑'
          data={this.props.arrBuildsName}
          selectedIndexes={this.props.selectDatas.get('selectBuilds')}
          onChanged={(index)=>this.props.filterChanged('building',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.selectDatas !== this.props.selectDatas){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
        dataSource: ds.cloneWithRows([0,1,2,3,4])
      });
    }

  }
  _getBottomButton()
  {
    return(
      <Bottom height={72} backgroundColor={'transparent'} borderColor={'transparent'}>
        <Button
          style={[styles.button,{
            backgroundColor:GREEN,
          }]}
          disabledStyle={[styles.button,{
              backgroundColor:GRAY,
            }]
          }
          textStyle={{
            fontSize:18,
            color:'#ffffff',
            fontWeight:'500',
          }}
          disabled={false}
          text='应用筛选条件' onClick={this.props.doFilter} />
      </Bottom>
    );
  }
  render() {
    var list = null
    if(!this.props.isFetching){
      list = (
        <View style={{flex:1}}>
          <ListView
            style={{flex:1,backgroundColor:'transparent'}}
            contentContainerStyle={{padding:16,paddingBottom:bottomHeight,backgroundColor:'transparent'}}
            dataSource={this.state.dataSource}
            renderSeparator={(sectionId, rowId, adjacentRowHighlighted)=> this._renderSeparator(sectionId,rowId)}
            renderRow={(rowData,sectionId,rowId) => this._renderRow(rowData,sectionId,rowId)}
          />
          {this._getBottomButton()}
        </View>
      )
    }
    else {
      list = (<Loading />);
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title='工单筛选'
          navIcon="close"
          onIconClicked={this.props.onClose}
          actions={[{
            title:'重置',
            show: 'always', showWithText:true}]}
            onActionSelected={[this.props.doReset]}
          />
        {list}
      </View>
    );
  }
}

TicketFilter.propTypes = {
  selectDatas:PropTypes.object,
  arrBuildsName:PropTypes.array,
  doFilter:PropTypes.func.isRequired,
  doReset:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  onClose:PropTypes.func.isRequired,
  filterChanged:PropTypes.func.isRequired,
}

var bottomHeight = 72;

var styles = StyleSheet.create({
  sepView:{
    height:16,
    backgroundColor:'transparent'
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    height:bottomHeight,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  button:{
    // marginTop:20,
    height:40,
    flex:1,
    marginHorizontal:16,
    borderRadius:4,
    shadowColor:'#000',
    shadowOffset:{width:1,height:2},
    shadowOpacity:0.5
  }
});
