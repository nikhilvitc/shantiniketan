import React, { useState } from "react";
import "./App.css";
import html2pdf from "html2pdf.js";

import logo from "./assets/logo.png";
import signature from "./assets/signature.png";
import watermark from "./assets/watermark.png"; // 10% opacity image

const sessions = Array.from({ length: 12 }, (_, i) => `${2016 + i}–${17 + i}`);

const subjects = [
  "Hindi",
  "Sanskrit",
  "English",
  "Math",
  "Science",
  "S.St.",
  "Sports",
  "Drawing",
  "Music",
  "Handcraft",
];

function App() {
  const [session, setSession] = useState("2024–25");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [marks, setMarks] = useState(Array(subjects.length).fill(""));

  const handleMarkChange = (index, value) => {
    const updated = [...marks];
    updated[index] = value;
    setMarks(updated);
  };

  const totalMarks = marks.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  const percentage = (totalMarks / (subjects.length * 100)) * 100;

  const downloadPDF = () => {
    const element = document.getElementById("marksheet");
    const opt = {
      margin: 0.3,
      filename: `${name || "marksheet"}_${studentClass || "class"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container">
      <form className="input-form">
        <label>
          Session:
          <select value={session} onChange={(e) => setSession(e.target.value)}>
            {sessions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Student's Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Father's Name:
          <input
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
        </label>
        <label>
          Class:
          <input
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          />
        </label>
      </form>

      <div id="marksheet" className="marksheet">
        <img src={watermark} alt="Watermark" className="watermark" />

        <div className="header">
          <div className="left">
            <p>
              <strong>Reg:</strong> 18/14
            </p>
          </div>
          <div className="center">
            <img src={logo} alt="logo" className="logo" />
            <h1>YUG NIRMAN VIDYALYA</h1>
            <h3>ADAURI, PURNAHIYA, SHEOHAR</h3>
            <p>
              <strong>Session:</strong> {session}
            </p>
          </div>
          <div className="right">
            <p>
              <strong>UDISE:</strong> 10032200106
            </p>
          </div>
        </div>

        <div className="student-details">
          <p>
            <strong>Student's Name:</strong> {name}
          </p>
          <p>
            <strong>Father's Name:</strong> {fatherName}
          </p>
          <p>
            <strong>Class:</strong> {studentClass}
          </p>
        </div>

        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>F. marks</th>
              <th>P. marks</th>
              <th>1st Terminal</th>
              <th>2nd Terminal</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject}>
                <td>{subject}</td>
                <td>100</td>
                <td>40</td>
                <td></td>
                <td></td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks[index]}
                    onChange={(e) => handleMarkChange(index, e.target.value)}
                    className="mark-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <p>
            <strong>MARKS OBTAINED:</strong> {totalMarks}
          </p>
          <p>
            <strong>PERCENTAGE:</strong> {percentage.toFixed(2)}%
          </p>
        </div>

        <div className="remarks">
          <p>
            <strong>Remarks:</strong> Pass
          </p>
        </div>

        <div className="signature-section">
          <img src={signature} alt="Signature" className="signature" />
          <p>Sign. of Principal</p>
        </div>
      </div>

      <button type="button" onClick={downloadPDF} className="download-btn">
        Download PDF
      </button>
    </div>
  );
}

export default App;
