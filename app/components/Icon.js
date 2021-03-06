'use strict'
import React,{Component,} from 'react';


import {Text,} from 'react-native';



export default class Icon extends Component {
  constructor(props){
    super(props);
  }
  render () {
    var {style,size,type,color} = this.props;

    var styles = [style,{backgroundColor:'transparent',fontFamily:'fontcustom',fontSize:size,color}];

    switch (type) {
      case 'ticket_notstart':
        return (
          <Text style={styles}>&#xf170;</Text>
        );
      case 'ticket_processing':
        return (
          <Text style={styles}>&#xf171;</Text>
        );
      case 'ticket_finished':
        return (
          <Text style={styles}>&#xf16f;</Text>
        );
      case 'arrow_right':
        return (
          <Text style={styles}>&#xf104;</Text>
        );
      case 'icon_device':
        return (
          <Text style={styles}>&#xf113;</Text>
        );
      case 'icon_device_box':
        return (
          <Text style={styles}>&#xf114;</Text>
        );
      case 'icon_panel':
        return (
          <Text style={styles}>&#xf126;</Text>
        );
      case 'icon_panel_box':
        return (
          <Text style={styles}>&#xf127;</Text>
        );
      case 'icon_building':
        return (
          <Text style={styles}>&#xf10a;</Text>
        );
      case 'icon_room':
        return (
          <Text style={styles}>&#xf12b;</Text>
        );
      case 'photo':
        return (
          <Text style={styles}>&#xf128;</Text>
        );
      case 'icon_scan':
        return (
          <Text style={styles}>&#xf13d;</Text>
        );
      case 'icon_bind':
        return (
          <Text style={styles}>&#xf198;</Text>
        );
      case 'icon_add':
        return (
          <Text style={styles}>&#xf100;</Text>
        );
      case 'icon_check':
        return (
          <Text style={styles}>&#xf161;</Text>
        );
      case 'icon_select':
        return (
          <Text style={styles}>&#xf16a;</Text>
        );
      case 'icon_unselect':
        return (
          <Text style={styles}>&#xf10d;</Text>
        );
      case 'icon_arrow_down':
        return (
          <Text style={styles}>&#xf102;</Text>
        );
      case 'icon_arrow_up':
        return (
          <Text style={styles}>&#xf106;</Text>
        );
      case 'icon_sync':
        return (
          <Text style={styles} >&#xf167;</Text>
        );
      case 'icon_success':
        return (
          <Text style={styles} >&#xf18e;</Text>
        );
      case 'icon_schneider_en':
        return (
          <Text style={styles}>&#xf146;</Text>
        )
      case 'icon_arrow_left':
        return (
          <Text style={styles}>&#xf103;</Text>
        )
      case 'icon_arrow_right':
        return (
          <Text style={styles}>&#xf104;</Text>
        )
      case 'icon_arrow_fold':
        return (
          <Text style={styles}>&#xf183;</Text>
        )
      case 'icon_arrow_unfold':
        return (
          <Text style={styles}>&#xf184;</Text>
        )
      case 'icon_arrow_up':
        return (
          <Text style={styles}>&#xf106;</Text>
        )
      case 'icon_arrow_down':
        return (
          <Text style={styles}>&#xf102;</Text>
        )
      case 'icon_over_due':
        return (
          <Text style={styles}>&#xf186;</Text>
        )
      case 'icon_alarm_ticket':
        return (
          <Text style={styles}>&#xf187;</Text>
        )
    }
  }
}

Icon.propTypes = {
  type:React.PropTypes.string.isRequired,
  color:React.PropTypes.string.isRequired,
  size:React.PropTypes.number.isRequired,
  style:React.PropTypes.any
};
