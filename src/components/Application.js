import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "components/DayList.js"
import Appointment from "components/Appointment"
import getAppointmentsForDay from "helpers/selectors.js"

import "components/Application.scss";




export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [
    {
      id: 1,
      time: "12pm",
    },
    {
      id: 2,
      time: "1pm",
      interview: {
        student: "Lydia Miller-Jones",
        interviewer: {
          id: 1,
          name: "Sylvia Palmer",
          avatar: "https://i.imgur.com/LpaY82x.png",
        }
      }
    },
    {
      id: 3,
      time: "2pm",
      interview: {
        student: "Rene Wang",
        interviewer: {
          id: 2,
          name: "Tori Malcolm",
          avatar: "https://i.imgur.com/Nmx0Qxo.png",
        }
      }
    },
    {
      id: 4,
      time: "1pm",
      interview: {
        student: "Christina Chung",
        interviewer: {
          id: 3,
          name: "Mildred Nazir",
          avatar: "https://i.imgur.com/T2WwVfS.png",
        }
      }
    },
    {
      id: 5,
      time: "1pm",
    }
    ]
  })

  const setDay = day => setState({...state, day})
  // const setDays = days => setState(prev => ({...prev, days}))
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // useEffect(() => {
  //   axios.get("/api/days")
  //     .then(res => {
  //       // setDays(res.data)
  //     })
  // }, [])

  Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments")
  ]).then((all) => {
    // console.log(all)
    setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}))
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => <Appointment key={appointment.id} {...appointment}/>)}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
