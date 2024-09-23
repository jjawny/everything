"use client";
import { Box, Checkbox, Skeleton } from "@mui/material";
import React from "react";
import CustomTooltip from "./CustomTooltip";

type ShortFormSkeletonProps = {
  isForceSkeleton: boolean;
  toggleIsForceSkeleton: (isOn: boolean) => void;
};

const ShortFormSkeleton: React.FC<ShortFormSkeletonProps> = (props) => {
  const { isForceSkeleton, toggleIsForceSkeleton } = props;

  return (
    <Box display={"flex"} flexDirection={"column"} gap={1}>
      <Skeleton variant="circular" width={"21px"} height={"21px"} />
      <Skeleton variant="rounded" sx={{ fontSize: "6.5rem" }} />
      <Skeleton variant="rounded" width={"100%"} height={32} style={{ marginBottom: 22 }} />
      <Skeleton variant="rounded" width={"100%"} height={45} />
      <Box display={"flex"} gap={2} flexWrap={"nowrap"}>
        <Skeleton variant="rounded" width={"100%"} height={30} />
        <Skeleton variant="rounded" width={"100%"} height={30} />
      </Box>
      <Box display={"flex"} gap={1} padding={"2px"} flexWrap={"nowrap"} alignContent={"center"}>
        {isForceSkeleton && (
          <CustomTooltip title={"Turn off skeleton"} arrow placement="bottom">
            <Checkbox
              checked={isForceSkeleton}
              onChange={(e) => toggleIsForceSkeleton(e.target.checked)}
              style={{ padding: 0, width: 20, height: 20 }}
            />
          </CustomTooltip>
        )}
        <Skeleton variant="rounded" width={20} height={20} />
        <Skeleton variant="rounded" width={40} height={20} />
        <Skeleton variant="rounded" width={80} height={20} />
        <Skeleton variant="rounded" width={80} height={20} />
      </Box>
    </Box>
  );
};

export default ShortFormSkeleton;
