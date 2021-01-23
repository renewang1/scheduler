import {useState, useEffect} from 'react'
import axios from "axios"

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: {}
  })

  const bookInterview = function(id, interview) {
    // console.log(state)
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let index = null;
    switch (true) {
      case id < 6:
        index = 0;
        break;
      case id < 11:
        index = 1;
        break;
      case id < 16:
        index = 2;
        break;
      case id < 21:
        index = 3;
        break;
      case id < 26:
        index = 4;
        break;
      default:
        index = null;
        break;
    }
    const spotMinusOne = state.days[index].spots - 1
    const stateDay = {...state.days[index], spots: spotMinusOne}
    const dayMinusCurrDay = []
    for (const item of state.days) {
      if (item.id < index + 1) {
        dayMinusCurrDay.push(item)
      }
    }
    dayMinusCurrDay.push(stateDay)
    for (const item of state.days) {
      if (item.id > index + 1) {
        dayMinusCurrDay.push(item)
      }
    }
    setState({...state, appointments, days: dayMinusCurrDay})
    return axios.put(`/api/appointments/${id}`, {interview})
  }

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`)
  }

  const setDay = day => setState({...state, day})

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

  return {state, setDay, bookInterview, cancelInterview}
}