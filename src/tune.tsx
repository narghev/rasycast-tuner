import { List, Icon, Color } from "@raycast/api";
import { useEffect } from "react";
import { useTuner } from "./hooks/useTuner";
import { centsToDisplayObject } from "./utils/display.utils";

export default function Command() {
  const { startContinuousListening, stopContinuousListening, detectedNote } = useTuner();

  useEffect(() => {
    startContinuousListening();

    return () => {
      stopContinuousListening();
    };
  }, [startContinuousListening, stopContinuousListening]);

  if (detectedNote) {
    const { noteName, cents } = detectedNote;

    const displayObject = centsToDisplayObject(cents);

    return (
      <List>
        <List.Item
          title={noteName}
          subtitle={`${cents > 0 ? "+" : ""}${cents} cents`}
          icon={{ source: displayObject.icon, tintColor: displayObject.color }}
        />
      </List>
    );
  }
  return (
    <List>
      <List.Item title="Play your instrument" icon={{ source: Icon.Heartbeat, tintColor: Color.Blue }} />
    </List>
  );
}
