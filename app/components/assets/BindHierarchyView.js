
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
} from 'react-native';

import Toolbar from '../Toolbar';
import List from '../List.js';
import HierarchyBindRow from './HierarchyBindRow';

export default class BindHierarchyView extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    var isCurrent = false;
    // if(rowData.get('Id') === this.props.currentPanel){
    //   isCurrent = true;
    // }
    return (
      <HierarchyBindRow currentRouteId={this.props.currentRouteId} isCurrent={isCurrent} rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }
  render() {
    var actions = null;
    // console.warn('BindHierarchyView..render ',this.props.isFetching,this.props.listData);
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={'选择设备'}
          navIcon="back"
          actions={actions}
          onActionSelected={[this.props.onScanClick]}
          onIconClicked={()=>this.props.onBack()}/>
          <List
            isFetching={this.props.isFetching}
            listData={this.props.listData}
            hasFilter={false}
            currentPage={1}
            totalPage={1}
            emptyText='此楼宇下没有资产'
            onRefresh={this.props.onRefresh}
            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          />
      </View>
    );
  }
}

BindHierarchyView.propTypes = {
  navigator:PropTypes.object,
  onScanClick:PropTypes.func.isRequired,
  user:PropTypes.object,
  currentRouteId:PropTypes.string,
  buildData:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  currentPanel:PropTypes.number,
  isFromScan:PropTypes.bool,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
}
