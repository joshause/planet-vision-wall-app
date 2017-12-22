import React, { Component } from 'react'
import '../style/App.css'
import Keyboard from './Keyboard'
import EventList from './EventList'
import fetchJsonp from 'fetch-jsonp'

class App extends Component {
  constructor() {
    super()
    this.state = {
      eventData: null,
      online: false
    }
  }

  _testOnline() {
    if (navigator.onLine) {
      this.setState ({
        online: true
      })
    } else {
      this.setState ({
        online: false
      })
    }
  }

  _getEventData() {
    var _this = this
    fetchJsonp(process.env.REACT_APP_EVENTS_REST_URL)
      .then(function (response) {
        return response.json()
      }).then(function(data) {
        _this.setState ({
          eventData: data
        })
        // update data every 5 min to account for active CMS updates
        setInterval(()=>_this._updateEventData(), (60000 * 5))
      }).catch(function (ex) {
        console.log('parsing failed', ex)
        // try again in 30 sec
        setTimeout(function () {
         _this._updateEventData()
       }, 30000)
      })
  }

  _updateEventData() {
    var _this = this
    if (navigator.onLine) {
      fetchJsonp(process.env.REACT_APP_EVENTS_REST_URL)
        .then(function (response) {
          return response.json()
        }).then(function(data) {
          _this.setState ({
            eventData: data
          })
        }).catch(function (ex) {
          console.log('parsing failed', ex)
          // try again in 30 sec
          setTimeout(function () {
           _this._updateEventData()
         }, 30000)
        })
    }
  }

  componentDidMount() {
    if (navigator.onLine) {
      // if data not pulled in prev mount, try again
      if (this.state.eventData === null) {
        this._getEventData()
      }
      this.setState ({
        online: true
      })
    }
    // test for online status every 30 sec
    setInterval(()=>this._testOnline(), 30000)
  }

  render() {

    return (
      <div id="app" className={!this.state.online ? 'offline' : ''} >
        <header id="header" className={!this.state.online ? 'offline' : ''} >
          <div id="wordmark" />
          <ul id="links">
            <li id="link-twitter"><span className="thick-one">@</span><span className="thick-two">@</span>PlanetVision</li>
            <li id="link-facebook"><span className="thick-one">@</span><span className="thick-two">@</span>PlanetVisionCAS</li>
            <li id="link-pv">PlanetVision.com</li>
          </ul>
        </header>
        <div id="offline" className={this.state.online ? 'hidden' : ''} >
          Visit PlanetVision.com
        </div>
        <div id="container-keyboard" className={!this.state.online ? 'hidden' : ''}  >
          <Keyboard online={this.state.online}
          //debug
          options={{
            type:'input',
            alwaysOpen: true,
            appendLocally: true,
            usePreview: false,
            useWheel: false,
            stickyShift: false,
            layout: 'custom',
            display: {
          		'bksp'   : 'delete',
          		'normal' : 'abc',
          		'accept' : 'submit',
              's' : 'shift'
          	},
            customLayout: {
              'normal': [
                '1 2 3 4 5 6 7 8 9 0 +',
          			'q w e r t y u i o p {bksp}',
          			'a s d f g h j k l \' %',
          			'{s} z x c v b n m @ . {s}',
          			'.com .org .edu {space} _ - {accept}'
          		],
              'shift': [
                '1 2 3 4 5 6 7 8 9 0 +',
                'Q W E R T Y U I O P {bksp}',
          			'A S D F G H J K L \' %',
          			'{s} Z X C V B N M @ . {s}',
          			'.com .org .edu {space} _ - {accept}'
          		]
          	}
          }}
        />
      </div>
      <div id="container-events" className={!this.state.online ? 'hidden' : ''} >
        <EventList dataset={this.state.eventData} />
      </div>
    </div>
    )

  }

}

export default App
