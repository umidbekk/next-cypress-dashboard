import { prisma } from "@/api/db";
import { AppTitle } from "@/app/AppLayout";
import { createServerSideProps } from "@/app/data/ServerSideProps";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
} from "@/shared/AppError";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Project } from "@prisma/client";
import NextLink from "next/link";

interface DeleteProjectPageProps {
  project: Project;
  errorCode?: AppErrorCode;
}

export const getServerSideProps = createServerSideProps<
  DeleteProjectPageProps,
  { projectId: string }
>(async ({ userId }, { query, params }) => {
  const projectId = params?.projectId;
  if (!projectId) return { notFound: true };

  const project = await prisma.project.findFirst({
    where: { id: projectId, users: { some: { id: userId } } },
  });

  if (!project) return { notFound: true };
  const deleteConfirmation = query.confirmation;
  if (!deleteConfirmation) return { props: { project } };

  if (deleteConfirmation != `${project.org}/${project.repo}`) {
    return { props: { project, errorCode: "BAD_REQUEST" } };
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { users: { disconnect: { id: userId } } },
    });

    return {
      redirect: {
        permanent: false,
        destination: `/app/projects?success=${encodeURIComponent(
          `${project.org}/${project.repo} removed`
        )}`,
      },
    };
  } catch (error) {
    return { props: { project, errorCode: extractErrorCode(error) } };
  }
});

export default function DeleteProjectPage({
  project,
  errorCode,
}: DeleteProjectPageProps) {
  return (
    <Dialog open={true}>
      <AppTitle breadcrumbs={["Projects", `${project.org}/${project.repo}`]} />

      <form>
        <DialogContent>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              This action cannot be undone. This will permanently revoke your
              access to the{" "}
              <Typography color="primary">
                {project.org}/{project.repo}
              </Typography>{" "}
              project.
            </Grid>

            <Grid item={true} xs={12}>
              <TextField
                required={true}
                autoFocus={true}
                fullWidth={true}
                error={!!errorCode}
                name="confirmation"
                label="Type project name to confirm"
                helperText={
                  errorCode === "BAD_REQUEST"
                    ? "Invalid project name"
                    : errorCode && formatErrorCode(errorCode)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <NextLink
            replace={true}
            passHref={true}
            href={`/app/projects/${project.id}/settings`}
          >
            <Button>Dismiss</Button>
          </NextLink>

          <Button type="submit">Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
