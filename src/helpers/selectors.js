function getAppointmentsForDay(state, day) {
  const appointments = [];
  const dayFilter = state.days.filter(item => item.name === day)
  const appointment_ids = dayFilter[0] ? dayFilter[0].appointments : []
  for (const item of appointment_ids) {
    for (const appointment in state.appointments) {
      if (item === state.appointments[appointment].id) {
        appointments.push(state.appointments[appointment])
      }
    }
  }

  //const dayFound = state.days.find(eachDay => eachDay.name === day)
  //if (!dayFound) {
    //return [];
  //}
  //const appointments = dayFound.appointments.map(appointmentID => state.appointments[appointmentID])
  
  return appointments;
}

function getInterview(state, interview) {
  let interviewData = null;
  for (const item in state.interviewers) {
    if (interview && state.interviewers[item].id === interview.interviewer) {
      interviewData = {student: interview.student, interviewer: state.interviewers[item]}
    }
  }
  return interviewData
}

module.exports = {getAppointmentsForDay, getInterview}