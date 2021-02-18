import { prisma } from "@/api/db";
import { GITHUB_CLIENT_SLUG } from "@/api/env";
import { GitHubClient } from "@/api/GitHubClient";
import {
  createServerSideProps,
  redirectToSignIn,
} from "@/app/data/ServerSideProps";
import {
  AppErrorCode,
  extractErrorCode,
  formatErrorCode,
  isGitHubIntegrationError,
} from "@/shared/AppError";
import { parseGitUrl } from "@/shared/GitUrl";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  TextField,
} from "@material-ui/core";
import NextLink from "next/link";
import React, { ReactElement } from "react";

interface AddProjectPageProps {
  errorCode?: AppErrorCode;
  gitHubClientSlug: string;
}

export const getServerSideProps = createServerSideProps<AddProjectPageProps>(
  async ({ userId }, context) => {
    const { repo: repoUrl } = context.query;
    const props: AddProjectPageProps = { gitHubClientSlug: GITHUB_CLIENT_SLUG };

    if (!repoUrl) {
      return { props };
    }

    if (typeof repoUrl != "string") {
      return { props: { ...props, errorCode: "BAD_REQUEST" } };
    }

    try {
      const [providerId, org, repo] = parseGitUrl(repoUrl);
      const client = await GitHubClient.create(userId);

      await client.verifyRepoAccess(org, repo);

      const project = await prisma.project.upsert({
        select: { id: true },
        update: { users: { connect: { id: userId } } },
        where: { org_repo_providerId: { org, repo, providerId } },
        create: {
          org,
          repo,
          providerId,
          secrets: { create: {} },
          users: { connect: { id: userId } },
        },
      });

      return {
        redirect: {
          permanent: false,
          destination: `/app/projects/${project.id}`,
        },
      };
    } catch (error: unknown) {
      const errorCode = extractErrorCode(error);

      if (isGitHubIntegrationError(errorCode)) {
        return redirectToSignIn(context);
      }

      return { props: { ...props, errorCode } };
    }
  }
);

export default function AddProjectPage({
  errorCode,
  gitHubClientSlug,
}: AddProjectPageProps): ReactElement {
  return (
    <Dialog open={true} fullWidth={true} maxWidth="xs">
      {errorCode ? (
        errorCode === "GITHUB_REPO_NOT_FOUND" ? (
          <Alert
            severity="error"
            action={
              <NextLink replace={true} passHref={true} href="/app/projects/add">
                <Button color="inherit">Close</Button>
              </NextLink>
            }
          >
            Repository not found, did you grant access for the{" "}
            <Link
              color="inherit"
              underline="always"
              href={`https://github.com/apps/${gitHubClientSlug}/installations/new`}
            >
              {gitHubClientSlug}
            </Link>{" "}
            app?
          </Alert>
        ) : (
          <Alert
            severity="error"
            action={
              <NextLink replace={true} passHref={true} href="/app/projects/add">
                <Button color="inherit">Close</Button>
              </NextLink>
            }
          >
            {formatErrorCode(errorCode)}
          </Alert>
        )
      ) : (
        <form method="get">
          <DialogContent>
            <TextField
              name="repo"
              label="Repo URL"
              required={true}
              fullWidth={true}
              autoFocus={true}
              placeholder="https://github.com/umidbekk/next-cypress-dashboard"
            />
          </DialogContent>

          <DialogActions>
            <NextLink replace={true} passHref={true} href="/app/projects">
              <Button>Dismiss</Button>
            </NextLink>

            <Button>Confirm</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
