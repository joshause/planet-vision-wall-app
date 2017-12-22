import React, {Component} from 'react'
import jQuery from 'jquery'
import keyboard from 'virtual-keyboard/dist/js/jquery.keyboard.js'
import '../style/Keyboard.css'

class VirtualKeyboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      error: false,
      classNameKeyboard: 'keyboard-wrapper',
      classNameErrorMessage: 'error-message',
      emailApiUrl: 'https://legacy.calacademy.org/enews/maropost/',
      errorMessage: 'Please enter valid email address',
      inputExpInterval: 5000,
      inputLastTimestamp: null,
      showThankYou: false
    }
  }

  componentDidMount() {

    this.setState({
      value: this.props.value
    })

    this.props.options.accepted = (event, keyboard, el) => {
      if (this.props.debug) {
        console.log("submitted: " + el.value)
      }
      // validate input value
      if (this._validateInput(el.value)) {
        this._postInput(el.value)
      } else {
        this.setState({
          error: true
        })
      }
    }

    this.props.options.change = (event, keyboard, el) => {
      if (this.props.debug) {
        console.log("changed: " + el.value)
      }
      this.setState({
        error: false
      })
      this._trackLastInputEntry()
    }

    // Add jQuery Keyboard to DOM Element
    this._addKeyBoardToDOM()

    // check for email input entry every 5 sec
    setInterval(()=>this._checkRecentInput(), (5000))

  }

  componentWillUnmount() {
    jQuery(this.keyboardRef).remove()
  }

  _trackLastInputEntry() {
    var date = new Date()
    this.setState({
      inputLastTimestamp: date
    })
  }

  _checkRecentInput() {
    var date = new Date()
    var diff = date - this.state.inputLastTimestamp
    if (diff > this.state.inputExpInterval) {
      // clear abandoned input
      document.getElementById('email-input').value = ''
      this.setState({
        error: false
      })
    }
  }

  _addKeyBoardToDOM() {
   let keyboardSelector = jQuery(this.keyboardRef);
   keyboardSelector.keyboard(this.props.options);

   // get instantiated keyboard
   this.keyboard = keyboardSelector.getkeyboard();
   this.interface = keyboard
 }

  _validateInput(data) {
    // super simple validation before posting data
    // to maropost api wrapper for stronger validation
    var re = /^.+@.+\..+$/
    if (this.props.debug) {
      console.log("email valid: " + re.test(data))
    }
    return re.test(data)
  }

  _onApiSuccess(data) {
    if (data.error) {
      this._onApiError(data)
    } else {
			console.log('Keyboard._onApiSuccess')
      // if email sign-up returns id, then success
      if (data.id) {
        console.log('Keyboard._onApiSuccess: api return SUCCESS')
        this.setState({
          showThankYou: true
        })
        // reset form after 8 sec
        setTimeout(()=>this._resetForm(), (8000))
      } else {
        console.log('Keyboard._onApiSuccess: api return FAIL')
        this.setState({
          error: true
        })
      }
		}
	}

  _onApiError(data) {
		console.log('Keyboard._onApiError: ' + data.error)
    this.setState({
      error: true
    })
	}

  _postInput(email) {
    const emailPostData = {
      subscribe: 0,
      email: email,
      list_ids: '100'
    }
    jQuery.ajax({
      dataType: 'jsonp',
  		url: this.state.emailApiUrl,
  		timeout: 10000,
  		data: emailPostData,
  		success: this._onApiSuccess.bind(this),
  		error: this._onApiError.bind(this)
  	})
    this._googleTagManagerEventSend('UI Sign-up Form', 'Form Submit', 'Email Address')
  }

  _resetForm() {
    document.getElementById('email-input').value = ''
    this.setState({
      showThankYou: false,
      error: false
    })
  }

  _customSubmitClick() {
    var email = document.getElementById('email-input').value
    // validate input value
    if (this._validateInput(email)) {
      this._postInput(email)
    } else {
      this.setState({
        error: true
      })
    }
  }

  _googleTagManagerEventSend(category=null, action=null, label=null) {

    // category: 'UI Sign-up Form'
    // action: 'Form Submit'
    // label: 'Email Address'

    if (category && action && label) {
      // console.log(category, action, label)
      window.dataLayer.push({
        'event': 'pv-event-trigger',
        'pv-category': category,
        'pv-action': action,
        'pv-label': label
      })
    }

  }

  render() {
    var _this = this
    var elementInput = <input
      className={ this.state.showThankYou ? 'hidden' : ''}
      id="email-input"
      placeholder="Email address"
      spellCheck="false"
      ref={node => this.keyboardRef = node}
    />
    var elementButton = <button
      className={ this.state.showThankYou ? 'hidden btnJoin' : 'btnJoin'}
      placeholder="Join Planet Vision"
      onClick={ _this._customSubmitClick.bind(_this) }
    >Join PlanetVision</button>
    return (
      <div className={ this.state.error ? "invalid" : "valid" }>

        <div id="signup-form" className={(!this.props.online || this.state.showThankYou) ? 'hidden' : ''} >
          <h1>Sign up</h1>
          <h2>to receive the PlanetVision Action Guide</h2>
        </div>
        <div id="thank-you" className={!this.state.showThankYou ? 'hidden' : ''}>
          <h1>Thank you!</h1>
          <p>
            Incredible things are possible when we work together, focus on
            solutions, and cultivate hope for a better world.
          </p>
        </div>
        <div>
          <div className={ this.state.classNameKeyboard }> { elementInput } </div>
          <div className={ this.state.classNameErrorMessage }>{ this.state.errorMessage }</div>
          <div> { elementButton } </div>
        </div>
      </div>
    )
  }
}

export default VirtualKeyboard
