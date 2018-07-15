import React from 'react';
import { WebView, View, Dimensions } from 'react-native';

export default class WebViewer extends React.Component {

  deviceHeight = Dimensions.get('window').height;
  deviceWidth = Dimensions.get('window').width;

  render() {
    return (
      <View>
        <WebView 
          scalesPageToFit 
          style={{
            width: this.deviceWidth - 20,
            height: this.deviceHeight
          }}
          source={{uri: this.props.url}} />
      </View>
    );
  }

}