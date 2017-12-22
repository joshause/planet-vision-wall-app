import React, {Component} from 'react'
import '../style/EventList.css'

class EventList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      timeNow: null,
      evergreenListItems: [
        {
          'id': 1,
          'header': 'Evergreen #1',
          'title': 'Title',
          'location': 'Location'
        },
        {
          'id': 2,
          'header': 'Evergreen #2',
          'title': 'Title',
          'location': 'Location'
        },
        {
          'id': 3,
          'header': 'Evergreen #3',
          'title': 'Title',
          'location': 'Location'
        },
        {
          'id': 4,
          'header': 'Evergreen #4',
          'title': 'Title',
          'location': 'Location'
        }
      ]
    }
  }

  _setTime() {
    var date = new Date()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    if (hours < 10) hours = "0" + hours.toString()
    if (minutes < 10) minutes = "0" + minutes.toString()
    var time = hours + '' + minutes
    this.setState ({
      timeNow: time
    })
  }

  _parseEventsByTime(data) {
    // extract events with multiple times into individual list items
    // and remove extracted events > 5 min older than now
    const arrayEventsByTime = []
    var _this = this

    if (data) {

      data.forEach(function(dataset) {
        if(dataset.time_slots) {
          if (Array.isArray(dataset.time_slots)) {
            var i = 0
            dataset.time_slots.forEach(function(ts) {
              var time = ts.replace(/:/, '')
              var obj = {
                'nid': dataset.nid + '' + i,
                'time': time,
                'title': dataset.title,
                'location': dataset.location
              }
              if (time > _this.state.timeNow) {
                arrayEventsByTime.push(obj)
              }
              i++
            })
          }
        }
      })

      // order new event list by time
      arrayEventsByTime.sort(function(a, b) {
        return (a.time > b.time)
      })

      // only use the first 3 events
      var subArrayEventsByTime = []
      if (arrayEventsByTime.length > 3) {
        subArrayEventsByTime = arrayEventsByTime.slice(0, 3)
      } else {
        subArrayEventsByTime = arrayEventsByTime
      }

      this.setState ({
        data: subArrayEventsByTime
      })
    }

  }

  _convertMilitaryTime(str) {
    var strTimes = ''
    var hours24 = parseInt(str.substring(0, 2),10)
    var hours = ((hours24 + 11) % 12) + 1
    var minutes = str.substring(2)
    strTimes += hours + ':' + minutes + ' '
    return strTimes
  }

  _getMeridiem(str) {
    var hours24 = parseInt(str.substring(0, 2),10)
    var amPm = hours24 > 11 ? 'pm' : 'am'
    return amPm
  }

  componentDidMount() {
    // set timeNow  every 1 minutes
    this._setTime()
    setInterval(()=>this._setTime(), (60000 * 1))

    this.setState ({
      evergreenListItems: this._randomizeListItems(this.state.evergreenListItems)
    })

  }

  componentWillReceiveProps(nextProps) {
    this._parseEventsByTime(nextProps.dataset)
  }

  _randomizeListItems(list) {
    var arr = list
    var currentIndex = arr.length
    var temporaryValue
    var randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = arr[currentIndex]
      arr[currentIndex] = arr[randomIndex]
      arr[randomIndex] = temporaryValue
    }
    var arrNew = arr
    return arrNew
  }

  render() {

    const rows = []
    const _this = this

    if (this.state.data) {
      this.state.data.forEach(function(dataset) {
        var dataTime = dataset.time
        var dataTitle = dataset.title
        var dataLocation = dataset.location
        var dataNid = dataset.nid

        var timeNewFormat = _this._convertMilitaryTime(dataTime)
        var timeMeridian = _this._getMeridiem(dataTime)

        var htmlTitle = {__html: dataTitle}
        var htmlLocation = {__html: dataLocation}

        if (htmlTitle.__html.toString().length > 25) {
          var subTitle = htmlTitle.__html.toString().substring(0, 25).trim() + '...'
          htmlTitle = {__html: subTitle}
        }

        var elementLi = <li
          key={dataNid} >
          <div className="event-list-item-container">
            <div className="event-list-item-time">{timeNewFormat}
              <span>{timeMeridian}</span>
            </div>
            <div className="event-list-item-title" dangerouslySetInnerHTML={htmlTitle} />
            <div className="event-list-item-location" dangerouslySetInnerHTML={htmlLocation} />
          </div>
        </li>
        rows.push(elementLi)
      })
    }

    const rowsEvergreen = []
    _this.state.evergreenListItems.forEach(function(item) {
      var li = <li
        key={item.id} >
        <div className="event-list-item-container">
          <div className="event-list-item-time">{item.header}</div>
          <div className="event-list-item-title">{item.title}</div>
          <div className="event-list-item-location">{item.location}</div>
        </div>
      </li>
      rowsEvergreen.push(li)
    })

    return (
      <div id="event-list">
        <header>
          <h3>Related Programs & Exhibits</h3>
        </header>
        <ul>
          {rows}
          {rowsEvergreen}
        </ul>
      </div>
    )
  }
}

export default EventList
