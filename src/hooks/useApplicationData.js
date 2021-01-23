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
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({...state, appointments})
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