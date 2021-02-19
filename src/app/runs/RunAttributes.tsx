import {
  ElectronFramework,
  Firefox,
  GoogleChrome,
  Linux,
  MicrosoftEdge,
  MicrosoftWindows,
  SourceBranch,
} from "@/app/icons";
import { Avatar, Chip, Grid, Tooltip } from "@material-ui/core";
import { AccessTime, Apple } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import React, { ReactElement } from "react";

export interface RunAttributesProps {
  run: Run;
  project: Project;
}

export function RunAttributes({
  run,
  project,
}: RunAttributesProps): ReactElement {
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true}>
        <Chip
          component="a"
          clickable={true}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/search?type=users&q=${encodeURIComponent(
            run.commitAuthorName
          )}`}
          label={run.commitAuthorName}
          avatar={
            <Avatar
              alt={run.commitAuthorName}
              src={`/avatar?email=${encodeURIComponent(run.commitAuthorEmail)}`}
            />
          }
        />
      </Grid>

      <Grid item={true}>
        <Tooltip title={run.createdAt.toLocaleString()}>
          <Chip
            icon={<AccessTime />}
            label={
              <>
                Created{" "}
                {formatDistanceToNow(run.createdAt, { addSuffix: true })}
              </>
            }
          />
        </Tooltip>
      </Grid>

      <Grid item={true}>
        <Chip
          component="a"
          target="_blank"
          clickable={true}
          label={run.commitBranch}
          icon={<SourceBranch />}
          rel="noopener noreferrer"
          href={`https://github.com/${project.org}/${project.repo}/commit/${run.commitSha}`}
        />
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${run.os} ${run.osVersion}`}>
          <Chip
            label={run.osVersion}
            icon={
              run.os === "darwin" ? (
                <Apple viewBox="0 0 24 26" />
              ) : run.os === "windows" ? (
                <MicrosoftWindows />
              ) : (
                <Linux />
              )
            }
          />
        </Tooltip>
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${run.browser} ${run.browserVersion}`}>
          <Chip
            label={run.browserVersion}
            icon={
              run.browser === "chrome" || run.browser === "chromium" ? (
                <GoogleChrome />
              ) : run.browser === "edge" ? (
                <MicrosoftEdge />
              ) : run.browser === "firefox" ? (
                <Firefox />
              ) : (
                <ElectronFramework />
              )
            }
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
}
