import React from "react";
import "./aiGeneration.css";

const AIGenerator = ({
  onPressGenerate,
  onPressStopGenerate,
  isGenerationComplete,
  isAIContentEmpty,
  buttonTextForGenerate = "Generate",
  buttonTextForLoading = "Stop generating",
  buttonTextForGenerationDone = "Regenerate",
}) => {
  if (isGenerationComplete) {
    return (
      <div>
        <button id="generate" onClick={onPressGenerate}>
          {!isAIContentEmpty ? buttonTextForGenerationDone : buttonTextForGenerate}
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button id="generate" onClick={onPressStopGenerate}>
          {buttonTextForLoading}
        </button>
      </div>
    );
  }
};

export default React.memo(AIGenerator);
