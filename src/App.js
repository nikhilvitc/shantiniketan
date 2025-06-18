import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import students from "./students";

import "./App.css";

import logo from "./assets/logo.png";
import signature from "./assets/signature.png";
import watermark from "./assets/watermark.png";
import mohar from "./assets/mohar.png";

const sessions = Array.from({ length: 12 }, (_, i) => `${2016 + i}–${17 + i}`);
const subjects = [
  "English",
  "Hindi",
  "Maths",
  "EVS/Science",
  "S.Science",
  "G.K.",
  "Sanskrit",
  "Art",
  "Oral",
];

function App() {
  const [session, setSession] = useState("2024–25");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const [term1, setTerm1] = useState(Array(subjects.length).fill(""));
  const [term2, setTerm2] = useState(Array(subjects.length).fill(""));
  const [selectedSubjects, setSelectedSubjects] = useState(Array(subjects.length).fill(true));

  const marksheetRef = useRef();

  const handleSubjectToggle = (index) => {
    const updated = [...selectedSubjects];
    updated[index] = !updated[index];
    setSelectedSubjects(updated);
  };

  const handleTermChange = (termSetter, index, value) => {
    const updated = [...termSetter];
    updated[index] = value;
    termSetter === term1 ? setTerm1(updated) : setTerm2(updated);
  };

  const activeSubjects = subjects
    .map((subject, index) => ({ subject, index }))
    .filter((_, index) => selectedSubjects[index]);

  const finalMarks = activeSubjects.map(({ index }) => {
    return (parseInt(term1[index]) || 0) + (parseInt(term2[index]) || 0);
  });

  const totalMarks = finalMarks.reduce((acc, val) => acc + val, 0);
  const maxTotal = activeSubjects.length * 100;
  const percentage = maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;

  const downloadPDF = () => {
    const inputs = document.querySelectorAll(".mark-input");
    const inputValues = [];

    inputs.forEach((input, i) => {
      const span = document.createElement("span");
      span.className = "mark-span";
      span.innerText = input.value;
      inputValues.push(input.value);
      input.parentNode.replaceChild(span, input);
    });

    const element = document.getElementById("marksheet");
    const opt = {
      margin: 0.3,
      filename: `${name || "marksheet"}_${studentClass || "class"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        const spans = document.querySelectorAll(".mark-span");
        spans.forEach((span, i) => {
          const input = document.createElement("input");
          input.type = "number";
          input.min = "0";
          input.max = "100";
          input.value = inputValues[i];
          input.className = "mark-input";
          span.parentNode.replaceChild(input, span);
        });
      });
  };

  return (
    <div className="container">
      <form className="input-form">
        <label>
          Session:
          <select value={session} onChange={(e) => setSession(e.target.value)}>
            {sessions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Student's Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Roll No:
          <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
        </label>
        <label>
          Class:
          <input type="text" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
        </label>
      </form>

      <div id="marksheet" className="marksheet" ref={marksheetRef}>
        <img src={watermark} alt="Watermark" className="watermark" />

        <div className="header">
          <div className="left"><p><strong>UDISE:</strong>10032202103</p></div>
          <div className="center">
            <img src={logo} alt="logo" className="logo" />
            <h1>SHANTI NIKETAN PUBLIC SCHOOL</h1>
            <h3>BEDAUL ADAM, PURNAHIYA, SHEOHAR </h3>
            <p><strong>Session:</strong> {session}</p>
          </div>
          <div className="right"></div>
        </div>

        <div className="student-details">
          <p><strong>Student's Name:</strong> {name}</p>
          <p><strong>Roll No:</strong> {fatherName}</p>
          <p><strong>Class:</strong> {studentClass}</p>
        </div>

        <table className="marks-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Subject</th>
              <th>Term I (50 marks)</th>
              <th>Term II (50 marks)</th>
              <th>Total (100 marks)</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              selectedSubjects[index] && (
                <tr key={subject}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSubjects[index]}
                      onChange={() => handleSubjectToggle(index)}
                    />
                  </td>
                  <td>{subject}</td>
                  <td>
                    <input
                      type="number"
                      className="mark-input"
                      value={term1[index]}
                      onChange={(e) => handleTermChange(term1, index, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="mark-input"
                      value={term2[index]}
                      onChange={(e) => handleTermChange(term2, index, e.target.value)}
                    />
                  </td>
                  <td>{finalMarks[activeSubjects.findIndex(s => s.index === index)] || 0}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <div className="summary">
          <p><strong>MARKS OBTAINED:</strong> {totalMarks}</p>
          <p><strong>PERCENTAGE:</strong> {percentage.toFixed(2)}%</p>
        </div>

        <div className="remarks"><p><strong>Remarks:</strong> Pass</p></div>

        <div className="marksheet-sign-row">
          <div className="marksheet-sign-block">
            <img src={signature} alt="Principal Signature" className="marksheet-signature" />
            <div className="marksheet-sign-label">Sign. of Principal</div>
            <img src={mohar} alt="School Stamp" className="marksheet-mohar" />
          </div>
        </div>
      </div>

      <button type="button" onClick={downloadPDF} className="download-btn">
        Download PDF
      </button>
    </div>
  );
}

export default App;
