import { List } from "@raycast/api";
import { useEffect } from "react";
import { useTuner } from "./hooks/useTuner";

export default function Command() {
  const { startContinuousListening, stopContinuousListening, isListening, detectedNote } = useTuner();

  useEffect(() => {
    startContinuousListening();

    return () => {
      stopContinuousListening();
    };
  }, [startContinuousListening, stopContinuousListening]);

  return (
    <List searchBarPlaceholder="Guitar Tuner - Play a note to detect pitch">
      <List.Item
        title={`Detected Note: ${detectedNote}`}
        subtitle={isListening ? "Listening for notes..." : "Ready to tune"}
        accessories={[
          {
            text: isListening ? "🎤 Listening" : "Ready",
          },
        ]}
      />
    </List>
  );
}
