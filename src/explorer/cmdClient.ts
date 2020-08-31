import { execSync } from "child_process";

export class GitCmdClient {
  private executionPath: string;

  constructor(path: string) {
    this.executionPath = path;
  }

  public branchesContaining(commitHash: string): string[] {
    const branches = execSync(`git branch -a --contains ${commitHash}`, {
      encoding: "utf8",
    });

    return branches
      .split("\n")
      .filter((h) => !!h)
      .map((branch) => branch.replace("*", "").trim());
  }

  public getFirstParentCommitHashes = (branch: string) => {
    const hashes = execSync(`git rev-list --first-parent ${branch}`, {
      encoding: "utf8",
      cwd: this.executionPath,
    });

    return hashes.split("\n");
  };

  public getCommitHashes = (branch: string) => {
    const hashes = execSync(`git rev-list ${branch}`, {
      encoding: "utf8",
      cwd: this.executionPath,
    });

    return hashes.split("\n");
  };

  public getLatestCommitHashFrom(branch: string): string {
    const commit = execSync(`git rev-parse ${branch}`, {
      encoding: "utf8",
      cwd: this.executionPath,
    }).replace("\n", "");

    return commit;
  }

  public getActualBranch(): string {
    // return execSync("git rev-parse --abbrev-ref HEAD", {
    return execSync('git branch | grep "^\\*" | cut -b 3-', {
      encoding: "utf8",
      cwd: this.executionPath,
    }).replace("\n", "");
  }
}
