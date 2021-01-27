import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: {},
  });

  const bookInterview = function (id, interview, edit) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        //Setting up appointment and appointments array to pass into setState with new interview
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        //Setting index to be 0, 1, 2, 3, or 4 depending on id corresponding to day of the week to access in state.days array
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
        if (!edit) {
          const spotMinusOne = state.days[index].spots - 1;
          //Subtracting 1 from spots and setting up new day object to pass into setState
          const stateDay = { ...state.days[index], spots: spotMinusOne };
          const dayMinusCurrDay = [];
          //Here I push each day object in order to state.days array otherwise days will become unordered in dayList
          for (const item of state.days) {
            if (item.id < index + 1) {
              dayMinusCurrDay.push(item);
            }
          }
          dayMinusCurrDay.push(stateDay);
          for (const item of state.days) {
            if (item.id > index + 1) {
              dayMinusCurrDay.push(item);
            }
          }
          setState({ ...state, appointments, days: dayMinusCurrDay });
        } else {
          setState({ ...state, appointments });
        }
      })
      .catch(() => {
        throw new Error("Error: Cannot save interview");
      });
  };

  const cancelInterview = function (id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
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
        //Adding 1 from spots and setting up new day object to pass into setState
        const spotPlusOne = state.days[index].spots + 1;
        const stateDay = { ...state.days[index], spots: spotPlusOne };
        //Here I push each day object in order to state.days array otherwise days will become unordered in dayList
        const dayMinusCurrDay = [];
        for (const item of state.days) {
          if (item.id < index + 1) {
            dayMinusCurrDay.push(item);
          }
        }
        dayMinusCurrDay.push(stateDay);
        for (const item of state.days) {
          if (item.id > index + 1) {
            dayMinusCurrDay.push(item);
          }
        }
        setState({ ...state, days: dayMinusCurrDay });
      })
      .catch(() => {
        throw new Error("Error: Cannot delete interview");
      });
  };

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    //Three get requests to get days, appointments, and interviews from server and set state using that data
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
