"use client";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { Box, Paper, Skeleton } from "@mui/material";
import React from "react";
import CustomSwitch from "../shared/CustomSwitch";
import CustomTooltip from "../shared/CustomTooltip";

type FastFormSkeletonProps = {
  isForceSkeleton: boolean;
  toggleIsForceSkeleton: (isOn: boolean) => void;
};

const FastFormSkeleton: React.FC<FastFormSkeletonProps> = (props) => {
  const { isForceSkeleton, toggleIsForceSkeleton } = props;

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        <Skeleton variant="circular" width={"21px"} height={"21px"} />
        <Skeleton variant="rounded" sx={{ fontSize: "6.5rem" }} />
        <Skeleton variant="rounded" width={"100%"} height={32} style={{ marginBottom: 22 }} />
        <Skeleton variant="rounded" width={"100%"} height={45} />
        <Box display={"flex"} gap={2} flexWrap={"nowrap"}>
          <Skeleton variant="rounded" width={"100%"} height={30} />
          <Skeleton variant="rounded" width={"100%"} height={30} />
        </Box>
      </Box>
      <Box display={"flex"} gap={"3px"} flexWrap={"wrap"} alignItems={"center"}>
        {isForceSkeleton && (
          <CustomTooltip title="Turn off skeleton" arrow>
            <CustomSwitch
              isOn={isForceSkeleton}
              handleToggle={toggleIsForceSkeleton}
              customIcon={<HourglassTopIcon />}
            />
          </CustomTooltip>
        )}
        {!isForceSkeleton && (
          <Skeleton
            variant="rounded"
            width={40}
            height={15}
            style={{ marginTop: "12px", marginBottom: "12px", marginRight: "22px", marginLeft: "12px" }}
          />
        )}
        <Skeleton
          variant="rounded"
          width={40}
          height={15}
          style={{ marginTop: "12px", marginBottom: "12px", marginRight: "22px" }}
        />
        <Skeleton
          variant="rounded"
          width={40}
          height={15}
          style={{ marginTop: "12px", marginBottom: "12px", marginRight: "22px" }}
        />
        <Skeleton variant="rounded" width={100} height={20} />
        <Skeleton variant="rounded" width={100} height={20} />
        <Skeleton variant="rounded" width={100} height={20} />
        <Skeleton variant="rounded" width={100} height={20} />
        <Skeleton variant="rounded" width={100} height={20} />
      </Box>
      <Paper elevation={1} style={{ marginTop: "8px", padding: "15px", paddingTop: "70px" }}>
        <Skeleton variant="rounded" width={"100%"} height={75} />
      </Paper>
    </>
  );
};

export default FastFormSkeleton;
