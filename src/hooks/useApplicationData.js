import {useState} from 'react'

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
  // const setDays = days => setState(prev => ({...prev, days}))
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview)
    const interviewers = getInterviewersForDay(state, state.day)
    return (
      <Appointment 
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  })

  useEffect(() => {
    // axios.get("/api/days")
    //   .then(res => {
    //     // setDays(res.data)
    //   })
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      // console.log(all)
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])
  
  return {state, setDay, bookInterview, cancelInterview}
}