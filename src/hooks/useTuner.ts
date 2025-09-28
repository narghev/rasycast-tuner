import { useCallback, useState, useRef } from "react";
import { soxUtils } from "../utils/sox.utils";

import { showToast, Toast } from "@raycast/api";
import { frequencyToNote, analyzeSingleChunk } from "../utils/note.utils";
import { sleep } from "../utils/general.utils";

const constants = {
  clarityThreshold: 0.3,
  minGuitarFreq: 80,
  maxGuitarFreq: 2000,
};

export const useTuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState("--");
  const shouldContinueListeningRef = useRef(false);

  const startContinuousListening = useCallback(async () => {
    if (!soxUtils.isSoxInstalled()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Sox not installed",
        message: "Run: brew install sox",
      });

      return;
    }

    shouldContinueListeningRef.current = true;
    setIsListening(true);

    await showToast({
      style: Toast.Style.Success,
      title: "Started listening",
      message: "Play a note on your instrument",
    });

    while (shouldContinueListeningRef.current) {
      try {
        const result = await analyzeSingleChunk();

        if (
          result &&
          result.pitch > 0 &&
          result.clarity > constants.clarityThreshold &&
          result.pitch >= constants.minGuitarFreq &&
          result.pitch <= constants.maxGuitarFreq
        ) {
          const noteInfo = frequencyToNote(result.pitch);
          setDetectedNote(`${noteInfo.note}`);
        } else {
          setDetectedNote("--");
        }

        await sleep(500);
      } catch (error) {
        console.log(error);
        setDetectedNote("Error");
        break;
      }
    }
  }, []);

  const stopContinuousListening = useCallback(() => {
    shouldContinueListeningRef.current = false;
    setDetectedNote("--");
    setIsListening(false);

    showToast({
      style: Toast.Style.Success,
      title: "Stopped listening",
    });
  }, []);

  return {
    isListening,
    detectedNote,
    startContinuousListening,
    stopContinuousListening,
  };
};
