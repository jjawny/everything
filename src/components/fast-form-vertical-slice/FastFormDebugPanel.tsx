"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";

const FastFormDebugPanel = <T,>() => {
  const { values: formValues, errors: formErrors } = useFormikContext<T>();
  const formValuesMemoized = useMemo(() => JSON.stringify(formValues, null, 2), [formValues]);
  const formErrorsMemoized = useMemo(() => JSON.stringify(formErrors, null, 2), [formErrors]);
  const fixFindDomNodeConsoleErrorRef = useRef(null);

  // To avoid accordion expanding when dragging, handle expanding manually to ignore drag events
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);

  const handleMouseDown = () => (isDraggingRef.current = false);
  const handleMouseMove = () => (isDraggingRef.current = true);
  const handleMouseUp = () => {
    if (!isDraggingRef.current) setIsExpanded((curr) => !curr);
  };

  return (
    <Draggable nodeRef={fixFindDomNodeConsoleErrorRef}>
      <div ref={fixFindDomNodeConsoleErrorRef}>
        <Accordion expanded={isExpanded}>
          <AccordionSummary
            id="debug-panel"
            aria-controls="debug-panel"
            expandIcon={<ExpandMoreIcon />}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            sx={{
              justifyContent: "space-between",
              "& .MuiAccordionSummary-content": {
                transform: "scaleX(3) translateX(36px)",
                maxWidth: "fit-content",
              },
            }}
          >
            DEBUG PANEL
          </AccordionSummary>
          <AccordionDetails>
            <Box ref={fixFindDomNodeConsoleErrorRef} borderRadius={1} style={{ backgroundColor: "lightgray" }}>
              <div className="p-1 text-xs">
                <pre>
                  <code>values: {formValuesMemoized}</code>
                </pre>
                <pre>
                  <code>errors: {formErrorsMemoized}</code>
                </pre>
              </div>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
    </Draggable>
  );
};

export default FastFormDebugPanel;
