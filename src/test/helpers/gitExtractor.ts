import { execSync } from "child_process";

export function commitMessageFrom(commitHash: string) {
  return execSync(`git log --format=%B -n 1 ${commitHash}`, {
    encoding: "utf8",
  }).trim();
}
