
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';

import Toolbar from '../Toolbar';


import StatableSelectorGroup from './StatableSelectorGroup';
import DateInputGroup from '../ticket/DateInputGroup';
import {GREEN,LIST_BG,GRAY} from '../../styles/color.js';
import Loading from '../Loading';
import Button from '../Button.js';
import Bottom from '../Bottom.js';

export default class AlarmFilter extends Component{
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
    // console.warn('_renderRow');
    if(rowData === 0){
      return (
        <DateInputGroup
          title='时间'
          startTime={this.props.filter.get('StartTime')}
          endTime={this.props.filter.get('EndTime')}
          onChanged={(type,text)=>{
            this.props.filterChanged(type,text);
          }} />
      );
    }else if(rowData === 1){
      return (
        <StatableSelectorGroup
          title='状态'
          data={['未解除','已解除']}
          selectedIndexes={this.props.filter.get('status')}
          onChanged={(index)=>this.props.filterChanged('status',index)} />
      );
    }
    else if(rowData === 2){
      return (
        <StatableSelectorGroup
          title='级别'
          data={['高级','中级','低级']}
          selectedIndexes={this.props.filter.get('level')}
          onChanged={(index)=>this.props.filterChanged('level',index)} />
      );
    }
    else if(rowData === 3){
      return (
        <StatableSelectorGroup
          title='类别'
          data={this.props.codes}
          selectedIndexes={this.props.filter.get('code')}
          onChanged={(index)=>this.props.filterChanged('code',index)} />
      );
    }
    else if(rowData === 4){
      if (!this.props.buildings || this.props.buildings.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title='建筑'
          data={this.props.buildings}
          selectedIndexes={this.props.filter.get('building')}
          onChanged={(index)=>this.props.filterChanged('building',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.filter !== this.props.filter){
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
    if(this.props.rawCodes && !this.props.isFetching){
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
          title='报警筛选'
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

AlarmFilter.propTypes = {
  filter:PropTypes.object,
  codes:PropTypes.array,
  rawCodes:PropTypes.object,
  buildings:PropTypes.array,
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
    height:43,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  }
});
