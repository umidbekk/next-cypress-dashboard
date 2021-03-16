import { DurationChip } from "@/core/components/DurationChip";
import { DebugStepOver, SyncCircle } from "@/core/components/icons";
import { Chip, Grid, Link, Tooltip } from "@material-ui/core";
import { Check, Error } from "@material-ui/icons";
import { Run, RunInstance } from "@prisma/client";
import NextLink from "next/link";
import React, { ReactElement } from "react";

export interface RunInstanceAttributesProps {
  run: Run;
  runInstance: RunInstance;
}

export function RunInstanceAttributes({
  run: { projectId },
  runInstance: {
    id,
    spec,
    runId,
    claimedAt,
    completedAt,
    totalPassed,
    totalFailed,
    totalPending,
    totalSkipped,
  },
}: RunInstanceAttributesProps): ReactElement {
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true}>
        <DurationChip start={claimedAt} finish={completedAt} />
      </Grid>

      {totalPassed > 0 && (
        <Grid item={true}>
          <Tooltip title="Passed">
            <Chip icon={<Check />} label={totalPassed} />
          </Tooltip>
        </Grid>
      )}

      {totalFailed > 0 && (
        <Grid item={true}>
          <Tooltip title="Failed">
            <Chip icon={<Error />} label={totalFailed} />
          </Tooltip>
        </Grid>
      )}

      {totalPending > 0 && (
        <Grid item={true}>
          <Tooltip title="Pending">
            <Chip icon={<SyncCircle />} label={totalPending} />
          </Tooltip>
        </Grid>
      )}

      {totalSkipped > 0 && (
        <Grid item={true}>
          <Tooltip title="Skipped">
            <Chip icon={<DebugStepOver />} label={totalSkipped} />
          </Tooltip>
        </Grid>
      )}

      <Grid item={true}>
        <NextLink
          passHref={true}
          href={`/projects/${projectId}/runs/${runId}/instances/${id}`}
        >
          <Link>{spec}</Link>
        </NextLink>
      </Grid>
    </Grid>
  );
}
