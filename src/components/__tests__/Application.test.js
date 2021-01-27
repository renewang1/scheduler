import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  prettyDOM,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  wait,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview, and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(container, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(container, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container, debug, getByTestId } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Check that the Form element is shown
    expect(getByTestId("student-name-input")).toBeInTheDocument();
    // 5. Edit the name for the interview
    const input = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Wait until the element with the new name is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 7. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    //Mock a rejection for the first axios put request
    axios.put.mockRejectedValueOnce();
    //Render the application
    const { container } = render(<Application />);
    //Wait for text "Archie Cohen" to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Click the "Add" button on the first appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    //Change the inputs and press the save button
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //Check that the "Saving" text is showing
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //Wait for error message to show
    await waitForElement(() =>
      getByText(appointment, "Could not save appointment")
    );
    //Close error message and check that spots are unaffected
    fireEvent.click(getByAltText(appointment, "Close"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    //Mock a rejection for the first axios delete request
    axios.delete.mockRejectedValueOnce();
    //Render the application
    const { container } = render(<Application />);
    //Wait for the text "Archie Cohen" to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Click the "Delete" button on the selected appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    //Check that delete confirmation message is shown and click confirm
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(container, "Confirm"));
    //Check that "Deleting" is shown
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    //Wait for error message to show
    await waitForElement(() =>
      getByText(appointment, "Could not delete appointment")
    );
    //Close error message and check that spots are unaffected
    fireEvent.click(getByAltText(appointment, "Close"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
