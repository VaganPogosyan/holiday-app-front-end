import React, { Component } from 'react'
import NewForm from './components/NewForm'

/*
Here we import our 3 API request methods from services/api.js.
We deconstruct them for simpler use further down in this file.

If you want to try using this code style you can remove the existing 
fetch request and uncomment the blocks of code in the farious 
API fetch methods. 
*/
import {
  updateCelebratedRequest,
  updateLikesRequest,
  deleteRequest
} from './services/api'


let baseURL = ''

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3003'
} else {
  baseURL = 'https://holiday-app-api.herokuapp.com/'
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      holidays: []
    }
    this.getHolidays = this.getHolidays.bind(this)
    this.handleAddHoliday = this.handleAddHoliday.bind(this)
  }

  componentDidMount() {
    this.getHolidays()
  }

  getHolidays() {
    fetch(baseURL + '/holidays')
      .then(data => { return data.json() }, err => console.log(err))
      .then(parsedData => this.setState({ holidays: parsedData }), err => console.log(err))
  }

  handleAddHoliday(holiday) {
    const copyHolidays = [...this.state.holidays]
    copyHolidays.unshift(holiday)
    this.setState({
      holidays: copyHolidays
    })
  }

  toggleCelebrated(holiday) {
    console.log('Sending a PUT request');

    fetch(baseURL + '/holidays/' + holiday._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ celebrated: !holiday.celebrated })
    }).then(res => res.json())
      .then(resJson => {
        console.log(resJson);
        const copyHolidays = [...this.state.holidays];
        const findIndex = this.state.holidays.findIndex(holiday => holiday._id === resJson._id);
        copyHolidays[findIndex] = resJson;

        this.setState({
          holidays: copyHolidays
        });
      })

    // updateCelebratedRequest(baseURL, holiday).then(updatedHoliday => {
    //   console.log(updatedHoliday);
    //   const copyHolidays = [...this.state.holidays];
    //   const findIndex = this.state.holidays.findIndex(holiday => holiday._id === updatedHoliday._id);
    //   copyHolidays[findIndex] = updatedHoliday;

    //   this.setState({
    //     holidays: copyHolidays
    //   });
    // })
  }

  /*
    - Updating Likes on a Holiday
    - FRONTEND: We need an event listener on the update element
    - FRONTEND: That event listener needs to update the mongo database (likes field)
        - fetch request to 3003/holidays/_id
    - FRONTEND: catch the response from our PUT request
    - FRONTEND: update state with that response
  */
  updateLikes(holiday) {
    console.log(holiday);

    fetch(baseURL + '/holidays/' + holiday._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: holiday.likes += 1 })
    }).then(res => res.json())
      .then(resJson => {
        console.log(resJson);
        const copyHolidays = [...this.state.holidays];
        const findIndex = this.state.holidays.findIndex(holiday => holiday._id === resJson._id);
        copyHolidays[findIndex] = resJson;

        this.setState({
          holidays: copyHolidays
        });
      })
    // updateLikesRequest(baseURL, holiday).then(updatedHoliday => {
    //   console.log(updatedHoliday);
    //   const copyHolidays = [...this.state.holidays];
    //   const findIndex = this.state.holidays.findIndex(holiday => holiday._id === updatedHoliday._id);
    //   copyHolidays[findIndex] = updatedHoliday;

    //   this.setState({
    //     holidays: copyHolidays
    //   });
    // })
  }

  deleteHoliday(id) {
    /*
      - Deleting a Holiday
        - Send a request to the DELETE route 
          - That route takes an id param
        - Update state and remove the holiday that was deleted
    */
    fetch(baseURL + '/holidays/' + id, {
      method: 'DELETE',
    }).then(res => {
      const copyHolidays = [...this.state.holidays];
      const findIndex = this.state.holidays.findIndex(holiday => holiday._id === id);
      copyHolidays.splice(findIndex, 1);
      this.setState({ holidays: copyHolidays });
    })

    // deleteRequest(baseURL, id);
    // const copyHolidays = [...this.state.holidays];
    // const findIndex = this.state.holidays.findIndex(holiday => holiday._id === id);
    // copyHolidays.splice(findIndex, 1);
    // this.setState({ holidays: copyHolidays });
  }

  render() {
    return (
      <div className='container'>
        <h1>Holidays! Celebrate!</h1>
        <NewForm handleAddHoliday={this.handleAddHoliday} />
        <table>
          <tbody>
            {this.state.holidays.map(holiday => {
              return (
                <tr key={holiday._id} >
                  <td onDoubleClick={() => this.toggleCelebrated(holiday)}
                    className={holiday.celebrated ? 'celebrated' : null}
                  >
                    {holiday.name}
                  </td>
                  <td> {holiday.likes} </td>
                  <td onClick={() => this.updateLikes(holiday)}> UPDATE (Likes) </td>
                  <td onClick={() => this.deleteHoliday(holiday._id)}>X</td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      </div>
    )
  }
}



export default App;
