import { GitCmdClient } from "./cmdClient";

export class StrategyCommitExplorer {
  private gitClient: GitCmdClient;

  constructor(gitLocation: string) {
    this.gitClient = new GitCmdClient(gitLocation);
  }

  public getBaseCommitHash = (refBranches: string[]) => {
    const branchName = this.gitClient.getActualBranch();
    const specialBranch = refBranches.includes(branchName);
    const commits = specialBranch
      ? this.gitClient.getFirstParentCommitHashes(branchName)
      : this.gitClient.getCommitHashes(branchName);

    // First commit which is contained in feat and also in protected branches (master or develop)
    const commitsPresentInProtectedBranches = commits.filter((hash: string) => {
      const branches = this.gitClient.branchesContaining(hash);

      for (const protectedBranch of refBranches) {
        const included = branches.includes(protectedBranch);

        if (included) {
          return true;
        }
      }

      return false;
    });

    if (commitsPresentInProtectedBranches.length === 0) {
      throw new Error("Git state not contemplated, please report use case.");
    }

    if (specialBranch) {
      const nextCommitToActual = commitsPresentInProtectedBranches[1];

      return nextCommitToActual;
    }

    const firstCommitPresent = commitsPresentInProtectedBranches[0];
    return firstCommitPresent;
  };

  public getCurrentCommitHash = (): string => {
    const actualBranch = this.gitClient.getActualBranch();
    const currentCommit = this.gitClient.getLatestCommitHashFrom(actualBranch);
    if (!currentCommit) {
      throw new Error(
        "reg-keygen-git-strategy plugin expects to work in a branch with commits"
      );
    }

    return currentCommit;
  };
}
