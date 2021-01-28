function getAppointmentsForDay(state, day) {
  const appointments = [];
  const dayFilter = state.days.filter((item) => item.name === day);
  const appointment_ids = dayFilter[0] ? dayFilter[0].appointments : [];
  for (const item of appointment_ids) {
    for (const appointment in state.appointments) {
      if (item === state.appointments[appointment].id) {
        appointments.push(state.appointments[appointment]);
      }
    }
  }
  return appointments;
}

function getInterviewersForDay(state, day) {
  const interviewers = [];
  const dayFilter = state.days.filter((item) => item.name === day);
  const interviewer_ids = dayFilter[0] ? dayFilter[0].interviewers : [];
  for (const item of interviewer_ids) {
    for (const interviewer in state.interviewers) {
      if (item === state.interviewers[interviewer].id) {
        interviewers.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewers;
}

function getInterview(state, interview) {
  let interviewData = null;
  for (const item in state.interviewers) {
    if (interview && state.interviewers[item].id === interview.interviewer) {
      interviewData = {
        student: interview.student,
        interviewer: state.interviewers[item],
      };
    }
  }
  return interviewData;
}

module.exports = { getAppointmentsForDay, getInterview, getInterviewersForDay };
