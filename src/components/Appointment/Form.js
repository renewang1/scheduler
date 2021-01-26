import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  //Resets name and interviewer, called when cancel button is clicked
  const reset = function () {
    setName("");
    setInterviewer(null);
  };
  //Validates whether name inputted, called when confirm button is clicked
  const validate = function() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    } else {
      setError(null)
    }
    props.onSave(name, interviewer);
  }
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={props.name}
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button
            danger
            onClick={() => {
              reset();
              props.onCancel();
            }}
          >
            Cancel
          </Button>
          <Button confirm onClick={() => validate()}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
