import React, { useState } from "react";
import InterviewerList from "components/InterviewerList"
import Button from "components/Button"

export default function Form(props) {
  const [name, setName] = useState(props.name || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)
  const reset = function() {
    setName("")
    setInterviewer(null)
  }
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={props.name}
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => {setName(event.target.value)}}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers}  value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => {
            reset()
            props.onCancel()
            }}>Cancel</Button>
          <Button confirm onClick={() => props.onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}