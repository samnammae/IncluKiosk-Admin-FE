import React from "react";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

import "./Calendar.css";
interface CalendarProps {
  setDate: any;
  date: any;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarProps> = ({ setDate, date, onClose }) => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen z-10"
        onClick={onClose}
      ></div>
      <div className="absolute right-1 top-full mt-2 z-20">
        <div className="calendar-container">
          <Calendar onChange={setDate} value={date} selectRange={true} />
        </div>
      </div>
    </>
  );
};

export default CalendarModal;
