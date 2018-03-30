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
    randomNumbers: [42, 69, 123],
    xkcdListLength: 1900,
    xkcdImage: "https://placebear.com/60/60",
    apiListLength: 1000,
    apiArray: null,
    firstApi: {
      title: "first api",
      logo: "https://placebear.com/40/40",
      description: "description",
      url: "api page link (if available)"
    },
    secondApi: {
      title: "second api",
      logo: "https://placebear.com/41/41",
      description: "description",
      url: "api page link (if available)"
    },
  }


  buttonClickHandler = () => {
    this.rollDatBall();
  }


  rollDatBall = () => {
    axios.all([
      axios.get('https://api.apis.guru/v2/list.json'), //apiGuru request
      axios.get('http://xkcd.com/info.0.json') //xkcd request
    ])
    .then(axios.spread((apiGuruResponse, xkcdResponse) => {
      var apiList = apiGuruResponse.data;
      var apiArray = Object.values(apiList);
      var apiListLength = apiArray.length;

      this.setState({ 
        apiListLength: apiListLength,
        apiArray: apiArray,
        xkcdListLength: xkcdResponse.data.num
      });

      this.getRandomApiNumbers();
    }))
    .catch((error) => {
      console.log('axios error:' + error);
    });
  }


  // getXkcdLatestNumber = () => {
  //   axios.get('http://xkcd.com/info.0.json')
  //   .then((response) => {
  //     this.setState({xkcdListLength: response.data.num});
  //   })
  //   .catch((error) => {
  //     console.log('axios error:' + error);
  //   });
  // }


  // getAllApiData = () => {
  //   axios.get('https://api.apis.guru/v2/list.json')
  //   .then((response) => {
  //     var apiList = response.data;
  //     var apiArray = Object.values(apiList);
  //     var apiListLength = apiArray.length;

  //     this.setState({ 
  //       apiListLength: apiListLength,
  //       apiArray: apiArray
  //     });
  //   })
  //   .catch((error) => {
  //     console.log('axios error:' + error);
  //   });
  // }


  apiPrintout(){
    
    var firstApi = this.state.apiArray ? Object.values(this.state.apiArray[this.state.randomNumbers[0]].versions)[0] : null;
    var secondApi = this.state.apiArray ? Object.values(this.state.apiArray[this.state.randomNumbers[1]].versions)[0] : null;

    var firstTitle, firstLogo, firstUrl, firstDescription;
    var secondTitle, secondLogo, secondUrl, secondDescription;

    if (firstApi && secondApi){
      firstTitle = firstApi.info.title != null ? firstApi.info.title : 'title missing';
      firstLogo = firstApi.info['x-logo'].url != null ? firstApi.info['x-logo'].url : '';
      firstUrl = firstApi.info['x-origin'].url != null ? firstApi.info['x-origin'].url : '';
      firstDescription = firstApi.info.description != null ? firstApi.info.description : 'description missing';

      secondTitle = secondApi.info.title != null ? secondApi.info.title : 'title missing';
      secondLogo = secondApi.info['x-logo'].url != null ? secondApi.info['x-logo'].url : '';
      secondUrl = secondApi.info['x-origin'].url != null ? secondApi.info['x-origin'].url : '';
      secondDescription = secondApi.info.description != null ? secondApi.info.description : 'description missing';
    }


    this.setState({
      firstApi: {
        title: firstTitle,
        logo: firstLogo,
        url: firstUrl,
        description: firstDescription
      },
      secondApi: {
        title: secondTitle,
        logo: secondLogo,
        url: secondUrl,
        description: secondDescription
      }
    });
  }


  getRandomApiNumbers = () => {
    var numbers = [];
    var randomApiKey = 'a67f0e8e-c37d-4ac0-9a67-99ddfb53c265';
    var requestUrl = 'https://api.random.org/json-rpc/1/invoke';
    var requestJson;
    
    requestJson = {
          'jsonrpc': '2.0',
          'method': 'generateIntegers',
          'params': {'apiKey': randomApiKey, 'n': 2, 'min': 1, 'max': this.state.apiListLength, 'replacement': false},
          'id': 42
        };

    axios.post(requestUrl, requestJson)
      .then((response) => {
          numbers = response.data.result.random.data;
          requestJson = {
            'jsonrpc': '2.0',
            'method': 'generateIntegers',
            'params': {'apiKey': randomApiKey, 'n': 2, 'min': 1, 'max': this.state.xkcdListLength, 'replacement': false},
            'id': 43
          }
          axios.post(requestUrl, requestJson)
          .then((response) => {
            numbers.push(response.data.result.random.data[0]);
            this.setState({ randomNumbers: numbers });
            this.getXkcdImg();
            this.apiPrintout();
          })
          .catch((error) => {
            console.log('axios error:' + error);
          });
      })
      .catch((error) => {
          console.log('axios error:' + error);
      });
  }


  getXkcdImg = () => {
    var index = this.state.randomNumbers[2];
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
      this.setState({ xkcdImage: response.data.img });
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
            I'm tired of seeing OCA kids "thinking about which APIs to use" for 48 of the 72 hours.
            Stop that. Hit the button, get two APIs plus an inspirational XKCD, and go write that mashup!
          </p>

          <button onClick={this.buttonClickHandler}>CLICK ME!</button>

          <div>
            <img src={this.state.xkcdImage} />
          </div>

          <div>
            <hr />
            <img src={this.state.firstApi.logo} />>
            <h1>FIRST API: {this.state.firstApi.title}</h1>
            <h3>DESCRIPTION: {this.state.firstApi.description}</h3>
            <a href={this.state.firstApi.url}>LINK</a>
          </div>

          <div>
            <hr />
            <img src={this.state.secondApi.logo} />>
            <h1>SECOND API: {this.state.secondApi.title}</h1>
            <h3>DESCRIPTION: {this.state.secondApi.description}</h3>
            <a href={this.state.secondApi.url}>LINK</a>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
