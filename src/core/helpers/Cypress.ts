import { trim } from "@/core/helpers/Text";
import { Browser, OS } from "@prisma/client";
import { JsonObject } from "type-fest";

export function toOS(input: unknown): OS {
  const os = trim(input).toLocaleLowerCase() as OS;

  switch (os) {
    case "linux":
    case "darwin":
    case "windows":
      return os;
  }

  return "unknown";
}

export function toBrowser(input: unknown): Browser {
  const browser = trim(input).toLocaleLowerCase() as Browser;

  switch (browser) {
    case "chrome":
    case "chromium":
    case "edge":
    case "electron":
    case "firefox":
      return browser;
  }

  return "unknown";
}

export interface CreateRunInput {
  specs: string[];
  group?: string | null;
  ciBuildId: string;
  projectId: string;
  recordKey?: string | null;
  commit: {
    sha: string;
    branch: string;
    authorName: string;
    authorEmail: string;
    message: string;
    remoteOrigin: string;
    defaultBranch: null | string;
  };
  platform: {
    osName: string;
    osVersion: string;
    osCpus: JsonObject[];
    osMemory: JsonObject;
    browserName: string;
    browserVersion: string;
  };
}

export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  isNewRun: boolean;
}

export interface CreateInstanceInput {
  groupId: string;
}

export interface CreateInstanceResponse {
  spec: null | string;
  instanceId: null | string;
  totalInstances: number;
  claimedInstances: number;
}

export interface UpdateInstanceInput {
  error: null | string;

  hooks: Array<Record<string, unknown>>;

  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    skipped: number;
    failures: number;
    wallClockStartedAt: string;
    wallClockEndedAt: string;
    wallClockDuration: number;
  };

  tests: null | Array<{
    body: string;
    state: string;
    title: string[];
    testId: string;
    attempts: JsonObject[];
    displayError: null | string;
  }>;

  video: boolean;
  videoUrl?: string;
  screenshots: JsonObject[];
  cypressConfig: JsonObject;
  reporterStats: JsonObject;
}

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: unknown[];
}

export const TEST_RESULT_STATES = [
  "started",
  "passed",
  "failed",
  "skipped",
] as const;
export type TestResultState = typeof TEST_RESULT_STATES[number];
export function toTestResultState(input: unknown): TestResultState {
  const state = trim(input).toLocaleLowerCase() as TestResultState;
  return TEST_RESULT_STATES.includes(state) ? state : "started";
}

export interface TestResult {
  id: string;
  titleParts: string[];
  state: TestResultState;
  displayError: null | string;
}
