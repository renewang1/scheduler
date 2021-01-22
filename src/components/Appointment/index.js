import React from "react";

import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import useVisualMode from "hooks/useVisualMode"

import "components/Appointment/styles.scss"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "SAVING"
const CONFIRM = "CONFIRM"
const DELETING = "DELETING"
const EDIT = "EDIT"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
  }

  function confirmDel() {
    transition(CONFIRM)
  }

  function cancelDel() {
    transition(SHOW)
  }

  function edit() {
    transition(EDIT)
    console.log(props)
  }
  
  function del() {
    transition(DELETING)
    props.cancelInterview(props.id)
    .then(transition(EMPTY))
  }
  
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === SAVING && <Status message={"Saving"}/>}
      {mode === DELETING && <Status message={"Deleting"}/>}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDel}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form onCancel={back} onSave={save} interviewers={props.interviewers}/>
      )}
      {mode === CONFIRM && <Confirm onCancel={cancelDel} onConfirm={del}/>}
      {mode === EDIT && <Form onCancel={cancelDel} onSave={save} name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers}/>}
    </article>
  );
}