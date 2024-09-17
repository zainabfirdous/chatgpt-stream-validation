import JobDescription from "./jobDescription";
import "./app.css"

function App() {
  const jobInfo = { jobTitle: "Barista", jobLocation: "Bangalore" };
  return (
    <div className="App">
      <JobDescription jobTitle={jobInfo.jobTitle} jobLocation={jobInfo.jobLocation} />
    </div>
  );
}

export default App;
