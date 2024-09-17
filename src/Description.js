import "./aiGeneration.css";

function Description({ renderAIToolbar, generatedHtml }) {
  return (
    <div id="container">
      {renderAIToolbar}
      <div id="aigeneratebox">
        <div id="text" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
      </div>
    </div>
  );
}

export default Description;
