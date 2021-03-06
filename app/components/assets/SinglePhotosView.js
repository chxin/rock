
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';

import Toolbar from '../Toolbar';

import List from '../List.js';
import PhotoThuNaiRow from './PhotoThuNaiRow.js';

export default class SinglePhotosView extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource:this.ds.cloneWithRows(props.data.toArray())};
  }
  _renderRow(rowData,sectionId,rowId){
    return (
      <PhotoThuNaiRow
        rowData={rowData}
        rowId={rowId}
        onRowClick={this.props.onRowClick} />
    );
  }
  _getToolbar(){
    return (
      <Toolbar
        title='图纸'
        navIcon="back"
        onIconClicked={this.props.onBack}
        />
    );
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
      this.setState({dataSource:this.ds.cloneWithRows(nextProps.data)})
    }
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getToolbar()}
        <List
          contentContainerStyle={styles.listGridStyle}
          isFetching={false}
          listData={this.state.dataSource}
          hasFilter={false}
          currentPage={1}
          totalPage={1}
          emptyText='没有图纸'
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
        />
      </View>
    );
  }
}

SinglePhotosView.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  data:PropTypes.object,
  onBack:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  listGridStyle:{
    justifyContent:'flex-start',
    flexDirection:'row',
    flexWrap:'wrap'
  },
});
