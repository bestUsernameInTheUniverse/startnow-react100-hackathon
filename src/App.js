import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
// import express from 'express'
import './App.css';
import { BrowserRouter} from 'react-router-dom';

// var proxyServer = express();

// proxyServer.get('/xkcd:number', function (req, res) {
//   var index = req.params["number"];

//   axios.get('https://xkcd.com/' + index + '/info.0.json', function (dataObj) {
//       if (dataObj) {
//           res.status(200).send(dataObj);
//       }
//       else {
//           res.status(500);
//       }      
//   });
// });

// proxyServer.listen(8484, function() {
//   console.log('Server is listening on http://localhost:4000');
// });


class App extends Component {

  state = {
    randomNumbers: [],
    xkcdImage: ""
  }


  clickHandler = () => {
    this.getRandomApiNumbers();
  }


  getRandomApiNumbers = () => {
    var numbers = [42];
    var randomApiKey = 'a67f0e8e-c37d-4ac0-9a67-99ddfb53c265';
    var requestUrl = 'https://api.random.org/json-rpc/1/invoke';
    var requestJson = {
          'jsonrpc': '2.0',
          'method': 'generateIntegers',
          'params': {'apiKey': randomApiKey, 'n': 10, 'min': 1, 'max': 1900, 'replacement': false},
          'id': 42
      }

    axios.post(requestUrl, requestJson)
      .then((response) => {
          console.log(response.data.result.random.data);
          numbers = response.data.result.random.data;
          this.setState({ randomNumbers: numbers });
          this.getXkcdImg();
      })
      .catch((error) => {
          console.log('axios error:' + error);
      });
  }


  getXkcdImg = () => {
    var numbers = this.state.randomNumbers;
    var index = numbers.pop();
    this.setState({
      randomNumbers: numbers
    });
    var requestUrl = 'https://xkcd.com/' + index + '/info.0.json';
    // var config = {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    //   }
    // };
    // console.log(requestUrl, config);

    // axios.get(requestUrl, config)
    axios.get(requestUrl)
    .then((response) => {
      console.log(response.data);
      this.setState({xkcdImage: response.data.img});
    })
    .catch((error) => {
      console.log('axios error:' + error);
    });
  }


  // makeCorsRequest = () => {
  //   var index = 42;
  //   var url = 'https://xkcd.com/' + index + '/info.0.json';

  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', url, true);
  //   if (!xhr) {
  //     alert('CORS not supported');
  //     return;
  //   }
  
  //   // Response handlers.
  //   xhr.onload = function() {
  //     var text = xhr.responseText;
  //     var title = text.match('<title>(.*)?</title>')[1];
  //     alert('Response from CORS request to ' + url + ': ' + title);
  //   };
  
  //   xhr.onerror = function() {
  //     alert('Woops, there was an error making the request.');
  //   };
  
  //   xhr.send();
  // }
  

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React, Bitches!</h1>
          </header>

          <p className="App-intro">
            Howdy
          </p>

          <img src={this.state.xkcdImage} />

          <button onClick={this.clickHandler}>hit me!</button>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
