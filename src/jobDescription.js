import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { fetchAIData, DONE_CHUNK } from "./util";
import AIGenerator from "./AIGenerator";
import { useFormik } from "formik";
import Description from "./Description";

function JobDescription(props) {
  const { jobTitle, jobLocation } = props;
  const AIContentEmpty = useRef(true);
  const abortControllerRef = useRef();
  const [Desc, setDesc] = useState("");
  const [isJDGenerationComplete, setIsJDGenerationComplete] = useState(true);

  const formik = useFormik({
    initialValues: {
      jobDescription: "",
    },
  });

  useEffect(() => {
    if (Desc) {
      formik.setFieldValue("jobDescription", Desc);
    }
    if (Desc?.length === 0) {
      AIContentEmpty.current = true;
    } else {
      AIContentEmpty.current = false;
    }
  }, [Desc]);

  const onPressGenerate = useCallback(async () => {
    setDesc("");
    setIsJDGenerationComplete(false);
    abortControllerRef.current = new AbortController();
    await fetchAIData({
      aiGenerationType: "jobDescription",
      aiGeneratorInput: {
        companyName: "Cafe Day",
        jobTitle: jobTitle,
        jobLocation: jobLocation,
      },
      dataUpdaterWithChunk: updateJobDescWithChunk,
      abortController: abortControllerRef.current,
    });
  }, [jobTitle, jobLocation]);

  const onPressStopGenerate = useCallback(async () => {
    abortControllerRef.current.abort();
    setIsJDGenerationComplete(true);
  }, []);

  const updateJobDescWithChunk = ({ chunk }) => {
    switch (chunk) {
      case DONE_CHUNK:
        setIsJDGenerationComplete(true);
        return;
      case "content":
        return;
      case '":"':
        return;
      default:
        setDesc((prevText) => `${prevText}${chunk}`);
        break;
    }
  };

  const renderAI = useCallback(() => {
    return (
      <AIGenerator
        onPressGenerate={onPressGenerate}
        onPressStopGenerate={onPressStopGenerate}
        isGenerationComplete={isJDGenerationComplete}
        isAIContentEmpty={AIContentEmpty.current}
      />
    );
  }, [jobTitle, jobLocation, isJDGenerationComplete]);

  return (
    <Description renderAIToolbar={renderAI()} generatedHtml={formik?.values?.jobDescription} />
  );
}

export default JobDescription;
