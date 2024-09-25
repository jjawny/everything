"use client";
import { FastFormModel, FastFormModelSchema } from "@/models/FastFormModel";
import BoltIcon from "@mui/icons-material/Bolt";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button } from "@mui/material";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button73 from "./Button73";
import CustomSwitch from "./CustomSwitch";
import CustomTooltip from "./CustomTooltip";

type FastFormControlPanelProps = {
  isSubmitDisabled?: boolean;
  isResetDisabled?: boolean;
  isFastForm: boolean;
  isForceSkeleton: boolean;
  isForceFailDuringSubmit: boolean;
  toggleIsFastForm: (isOn: boolean) => void;
  toggleIsForceSkeleton: (isOn: boolean) => void;
  toggleIsForceFailDuringSubmit: (isOn: boolean) => void;
};

const FastFormControlPanel: React.FC<FastFormControlPanelProps> = (props) => {
  const {
    isSubmitDisabled = false,
    isResetDisabled = false,
    isFastForm,
    isForceSkeleton,
    isForceFailDuringSubmit,
    toggleIsFastForm,
    toggleIsForceSkeleton,
    toggleIsForceFailDuringSubmit,
  } = props;

  const { values, validateForm } = useFormikContext<FastFormModel>();

  const handleDownload = () => {
    const formJson = JSON.stringify(values);
    const formBlob = new Blob([formJson], { type: "application/json" });

    // Must be removed manually otherwise stays alive for the lifetime of the document (heap?)
    const downloadUrl = URL.createObjectURL(formBlob);
    {
      // Attach temp <a> to the DOM and simulate click event
      const tempLinkElement = document.createElement("a");
      tempLinkElement.href = downloadUrl;
      tempLinkElement.download = "PERFECT test file.json";
      document.body.appendChild(tempLinkElement);
      tempLinkElement.click();
      document.body.removeChild(tempLinkElement);
    }
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <UploadFileButton />
      <Box display="flex" justifyContent="space-between" paddingTop={1} gap={1}>
        <Button
          variant="outlined"
          fullWidth
          size="small"
          type="reset"
          disabled={isResetDisabled}
          endIcon={<ClearIcon />}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="small"
          type="submit"
          disabled={isSubmitDisabled}
          color="primary"
          endIcon={<DoneIcon />}
        >
          Submit
        </Button>
      </Box>
      <Box display={"flex"} flexWrap={"wrap"} alignItems={"center"} gap={"3px"}>
        <CustomTooltip title="Force skeleton (destroys the form!!!)" arrow>
          <CustomSwitch
            isOn={isForceSkeleton}
            handleToggle={toggleIsForceSkeleton}
            customIcon={<HourglassBottomIcon />}
          />
        </CustomTooltip>
        <CustomTooltip title="Force a valid form to fail during submit" arrow>
          <CustomSwitch
            isOn={isForceFailDuringSubmit}
            handleToggle={toggleIsForceFailDuringSubmit}
            customIcon={<FeedbackIcon />}
          />
        </CustomTooltip>
        <CustomTooltip title="Use the fast form">
          <CustomSwitch isOn={isFastForm} handleToggle={toggleIsFastForm} customIcon={<BoltIcon />} />
        </CustomTooltip>
        <CustomTooltip title="Validate now" arrow>
          <Button73 text="✔️ VALIDATE NOW" handleClick={() => validateForm()} />
        </CustomTooltip>
        <CustomTooltip title={"Save your current progress in JSON"} arrow>
          <Button73 text="⬇️ Save form" handleClick={handleDownload} />
        </CustomTooltip>
        <CustomTooltip title="Perfect JSON to test upload" arrow>
          <a href="/files/fast-form-perfect-model-to-upload.json" download="PERFECT test file.json">
            <Button73 text="⬇️ PERFECT form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
        <CustomTooltip title="Good but invalid JSON to test upload" arrow>
          <a href="/files/fast-form-okay-model-to-upload.json" download="GOOD test file.json">
            <Button73 text="⬇️ OKAY form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
        <CustomTooltip title="Malformed JSON to test upload" arrow>
          <a href="/files/fast-form-bad-model-to-upload.json" download="BAD test file.json">
            <Button73 text="⬇️ BAD form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
      </Box>
    </Box>
  );
};

const UploadFileButton: React.FC = () => {
  const { setValues } = useFormikContext<FastFormModel>();
  const [isHoveringFile, setIsHoveringFile] = useState<boolean>(false);

  const preventBrowserDefaultBehaviour = (e: React.MouseEvent | React.KeyboardEvent | React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const loadFileContent = (file: File | undefined) => {
    if (!file) return;

    const parsingFilePromise = new Promise((resolve, reject) => {
      const reader = new FileReader(); // Don't worry, GC will clean this up...
      reader.onload = async (e) => {
        try {
          const rawContent = e.target?.result as string;
          const jsonContent = JSON.parse(rawContent);
          const newValues = await FastFormModelSchema.cast(jsonContent);
          setValues(newValues);
          resolve(newValues);
        } catch (err) {
          console.warn("Unable to parse uploaded file", err);
          reject(new Error("Unable to load your file"));
        }
      };
      reader.readAsText(file);
    });

    toast.promise(
      parsingFilePromise,
      {
        loading: "Loading file...",
        success: "Pre-filled with your file!",
        error: (e: Error) => e.message,
      },
      { error: { icon: "⚠️" } } // most times the user's file is the problem, don't imply (red) error
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    loadFileContent(file);
    event.target.value = ""; // allow re-upload w same file name
  };

  const handleOnDrag = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
    const file = event.dataTransfer.files?.[0];
    loadFileContent(file);
    setIsHoveringFile(false);
  };

  const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
  };

  return (
    <div
      onDrop={handleOnDrag}
      onDragOver={handleOnDragOver}
      onDragEnter={() => setIsHoveringFile(true)}
      onDragLeave={() => setIsHoveringFile(false)}
      className={isHoveringFile ? "duration-150 ease-in-out scale-105" : ""}
    >
      <Button
        startIcon={<UploadFileIcon />}
        variant="outlined"
        component="label"
        size="small"
        color="info"
        fullWidth
        style={{ padding: 10 }}
      >
        Pre-fill with your JSON file
        <input type="file" accept=".json" hidden onChange={handleFileUpload} />
      </Button>
    </div>
  );
};

const MemoizedFastFormControlPanel = React.memo(FastFormControlPanel);

export default MemoizedFastFormControlPanel;
