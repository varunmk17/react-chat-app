import React, { Component } from 'react';
import { Widget, addResponseMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {contexts: [], convId: ''};
  }

  findOrCreateContext(convId) {
    if (!this.state.contexts[convId]) {
      this.state.contexts[convId] = {context: {}};
    }
    return this.state.contexts[convId];
  }

  componentDidMount() {
    this.CallApi({});
  }

  CallApi(payload) {
    var parsedResponse;

    axios.post('https://chat-bot-server.mybluemix.net/api/message', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      input: {
          text: payload.text
      },
      context: payload.context
      }
    )
    .then(function (response) {
        parsedResponse = JSON.parse(response.request.response)
        addResponseMessage(parsedResponse.output.text.join());
        return parsedResponse;
    })
    .then((res) => {
      if(!this.state.convId) {
        this.setState({
          convId: parsedResponse.context.conversation_id
        })
      }
      this.state.contexts[this.state.convId] = parsedResponse.context;
    })
    .catch(function (error) {
      console.log(error);
      return 'Oops. Could not connect chat server'
    });
  }

  handleNewUserMessage = (newMessage) => {
    var conversationContext = this.findOrCreateContext(this.state.convId); 
    var payload = {
      text: newMessage,
      context: conversationContext
    }
    this.CallApi(payload);
  }

  render() {
    return (
      <div className="App">
        <Widget 
          title="Chat with CHIA"
          subtitle=""
          handleNewUserMessage={this.handleNewUserMessage}
        />
      </div>
    );
  }
}

export default App;
