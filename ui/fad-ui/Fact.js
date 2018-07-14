import React from 'react';
import { Share } from 'react-native';
import { Card, CardItem, Body, Text, Button, Icon, Left, Right } from 'native-base';

export default class Fact extends React.Component {

  constructor(props) {
    super(props);
  }

  openShareDialog = () => {
    Share.share({
      url: 'http://google.com',
      title: 'This is some shareable content',
      message: 'This is just a test message for sharing'
    });
  };

  render() {
    return (
      <Card>
        <CardItem>
          <Body>
            <Text>
              {this.props.fact}
            </Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent onPress={this.openShareDialog}>
              <Icon active name="share" />
              <Text>Share</Text>
            </Button>
          </Left>
          <Body>
            <Button transparent>
              <Icon active name="chatbubbles" />
              <Text>4 Comments</Text>
            </Button>
          </Body>
          <Right>
            <Text>11h ago</Text>
          </Right>
        </CardItem>
      </Card>
    );
  }

}