import React from 'react';
import WebViewer from './WebViewer';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

import Fact from './Fact';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      randomFact: '',
      displayWebView: false
    };
    fetch('https://pqqt1y9htj.execute-api.us-east-1.amazonaws.com/test/')
      .then((response) => response.json())
      .then((body) => {
        setTimeout(() => {
          this.setState({ randomFact: body[0] });
        }, 1500);
      });
  }

  showWebView = () => {
    this.setState({ displayWebView: true });
  };
  hideWebView = () => {
    this.setState({ displayWebView: false });
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
          {this.state.displayWebView ? (
            <Button hasText transparent onPress={this.hideWebView}>
              <Text>Back</Text>
            </Button>
          ) : null}
          </Left>
          <Body>
            <Title>The Daily Fact</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{padding: 10}}>
          {
            this.state.displayWebView ? (
              <WebViewer url={this.state.randomFact.link} />
            ) : (
              <Fact fact={this.state.randomFact} onViewSource={this.showWebView} />
            )
          }
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}