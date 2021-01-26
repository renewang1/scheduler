import React from "react";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //Saves name and interviewer in state and server and transitions to SAVING
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function confirmDel() {
    transition(CONFIRM);
  }

  function cancelDel() {
    transition(SHOW);
  }

  function edit() {
    transition(EDIT);
  }
  //Sends delete request to server and transitions to EMPTY
  function del() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => {
        transition(ERROR_DELETE, true);
        console.log("inside error", props);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
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
        <Form onCancel={back} onSave={save} interviewers={props.interviewers.toString()} />
      )}
      {mode === CONFIRM && <Confirm onCancel={back} onConfirm={del} />}
      {mode === EDIT && (
        <Form
          onCancel={cancelDel}
          onSave={save}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers.toString()}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message={"Could not save appointment"} onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message={"Could not delete appointment"} onClose={cancelDel} />
      )}
    </article>
  );
}
