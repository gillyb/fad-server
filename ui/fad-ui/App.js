import React from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

import Fact from './Fact';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      randomFact: ''
    };
    fetch('https://pqqt1y9htj.execute-api.us-east-1.amazonaws.com/test/')
      .then((response) => response.json())
      .then((body) => {
        setTimeout(() => {
          this.setState({ randomFact: body[0].title });
        }, 1500);
      });
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>The Daily Fact</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Fact fact={this.state.randomFact} />
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