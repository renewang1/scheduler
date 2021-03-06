import React from "react";
import PropTypes from "prop-types";

import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  //Getting array of interviewers and mapping interviewer to generate an InterviewerListItem
  const interviewerArr = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.value}
        setInterviewer={() => {
          props.onChange(interviewer.id);
        }}
      />
    );
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerArr}</ul>
    </section>
  );
}
//Checking if props.interviewers is an array
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired,
};
