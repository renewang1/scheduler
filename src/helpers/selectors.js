export default function getAppointmentsForDay(state, day) {
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
  return appointments;
}