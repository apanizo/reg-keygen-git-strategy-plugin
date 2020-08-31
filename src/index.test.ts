import { execSync } from "child_process";
import * as path from "path";
import * as process from "process";
import rimraf from "rimraf";
import { commitMessageFrom } from "./test/helpers/gitExtractor";
import { createGitStrategyPlugin } from "./test/helpers/pluginCreator";

process.chdir("./test");

const removeGitFolder = () =>
  rimraf.sync(path.resolve(__dirname, "../test/.git"));

afterEach(removeGitFolder);

const copyGitFiles = (name: string) => {
  execSync(
    `cp -r ${path.resolve("fixtures", name)}/ ${path.resolve("./.git")}`
  );
};

describe("Most common git usage", () => {
  test("Throw an error if git was not initialised", () => {
    copyGitFiles("no-git-available");
    removeGitFolder();
    const gitStrategyPlugin = createGitStrategyPlugin();

    expect(() => gitStrategyPlugin.getActualKey()).toThrowError(
      new Error("This plugin expects to have a git folder")
    );

    expect(() => gitStrategyPlugin.getExpectedKey()).toThrowError(
      new Error("This plugin expects to have a git folder")
    );
  });

  test("Throw an error if git has no commits", () => {
    copyGitFiles("no-commits");
    const gitStrategyPlugin = createGitStrategyPlugin();

    expect(() => gitStrategyPlugin.getActualKey()).toThrowError(
      new Error(
        "reg-keygen-git-strategy plugin expects to work in a branch with commits"
      )
    );
  });

  /*
      * a8eb99e (HEAD -> feat-one) feat one commit 4
      * 5a8b9e5 feat one commit 3
      * 5d85df0 feat one commit 2
      * 156d37a feat one commit 1
      | * fb3ed3a (feat-two) feat two commit 2
      | * 40a0978 feat two commit 1
      | * 2a82bea (develop) fourth commit in develop
      | * dde40a7 third commit in develop
      |/  
      * c3cfd4e second commit in develop
      * 2d45426 first commit in develop
   */

  test("Calculate expected and base commit from regular feature development :: checkout from develop", async () => {
    copyGitFiles("regular-branches-from-develop");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("feat one commit 4");

    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit in develop");
  });

  test("Calculate expected and base commit from regular huge feature development :: checkout from develop", async () => {
    copyGitFiles("regular-huge-branches-from-develop");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("feat one commit 200");

    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit in develop");
  });

  /*
    Merge made by the 'recursive' strategy.
    *   d115009 (HEAD -> feat-one) Merge branch 'feat-one-v2' into feat-one
    |\  
    | * 1e21716 (feat-one-v2) feat one v2 commit 3
    | * c142129 feat one v2 commit 2
    | * d7dac5f feat one v2 commit 1
    * | 48df815 feat one commit 4
    |/  
    * d78098e feat one commit 3
    * 4fdae96 feat one commit 2
    * b52a465 feat one commit 1
    | * 0db7e73 (feat-two) feat two commit 2
    | * 6f452a1 feat two commit 1
    | * 17bcb17 (develop) fourth commit in develop
    | * 02e78bb third commit in develop
    |/  
    * 7a53d68 second commit in develop
    * f3b35bf first commit in develop
  */
  test("Calculate expected and base commit from regular feature development with merge request :: checkout from develop", async () => {
    copyGitFiles("regular-branches-with-merges-from-develop");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("merge feat-one-v2 to feat-one");

    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit in develop");
  });

  /*
    * e62bc6b (HEAD -> feat-one-v2) feat one v2 commit 3
    * 200ff76 feat one v2 commit 2
    * 5087583 feat one v2 commit 1
    | * 3bc16ea (feat-two) feat two commit 2
    | * 5f2e1a0 feat two commit 1
    | * d042d37 (develop) fourth commit in develop
    | * 9ee8583 third commit in develop
    | | * 26edcfc (feat-one) feat one commit 4
    | |/  
    |/|   
    * | 98c2c23 feat one commit 3
    * | 504fd07 feat one commit 2
    * | b90e720 feat one commit 1
    |/  
    * 8992ce2 second commit in develop
    * 42f19a1 first commit in develop
  */
  test("Calculate expected and base commit of branch from feat branch", async () => {
    copyGitFiles("branch-of-regular-feat-branch");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("feat one v2 commit 3");

    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit in develop");
  });

  /*
    *   ce5c3f2 (HEAD -> develop) merge feat-two to develop
    |\  
    | * db63a22 (feat-two) feat two commit 2
    | * f780320 feat two commit 1
    * |   e543801 merge feat-one to develop
    |\ \  
    | |/  
    |/|   
    | * 552677b (feat-one) feat one commit 3
    | * e5a262c feat one commit 1
    * | aacd9a7 feat one commit 2
    * | ef86a6a third commit in develop
    |/  
    * 62fe818 second commit in develop
    * 255b5c2 first commit in develop
  */
  test("Calculate expected and base commit on key branches", async () => {
    copyGitFiles("key-branch-with-merges");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("merge feat-two to develop");

    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("merge feat-one to develop");
  });

  test("detached head", async () => {
    copyGitFiles("detached-head");
    const gitStrategyPlugin = createGitStrategyPlugin();

    try {
      await gitStrategyPlugin.getActualKey();
    } catch (err) {
      expect(err.message).toContain(
        "Command failed: git rev-parse (HEAD detached at"
      );
    }
  });

  /*
   * first commit
   */
  test("initial commit", async () => {
    copyGitFiles("initial-commit");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    expect(baseHash).toBe("");
  });

  /*
   * (HEAD -> master) two commit
   * first commit
   */
  test("master two commits", async () => {
    copyGitFiles("master-two-commits");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    expect(baseHash).not.toBeNull();
  });

  /*
   * (HEAD -> feat-y, master) second commit
   * first commit
   */
  test("after create new branch", async () => {
    copyGitFiles("after-create-new-branch");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit");
  });

  /*
   * (HEAD -> feat-y) y1
   * (tag: expected, master) second commit
   * first commit
   */
  test("commit after create new branch", async () => {
    copyGitFiles("commit-new-branch");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit");

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("y1");
  });

  /*
   * (HEAD -> feat-y) y2
   * y1
   * (tag: expected, master) second commit
   * first commit
   */
  test("two commits after create new branch", async () => {
    copyGitFiles("two-commit-new-branch");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("second commit");

    const actualHash = await gitStrategyPlugin.getActualKey();
    const actualCommitMessage = commitMessageFrom(actualHash);
    expect(actualCommitMessage).toBe("y2");
  });

  /*
    *   (HEAD -> feat-x) merge master to feat-x
    |\
    | * (tag: expected, master) master1
    * | x2
    * | x1
    |/
    * second commit
    * first commit
  */
  test("after catch up master merge", async () => {
    copyGitFiles("after-catch-up-master");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master1");
  });

  /*
    * (HEAD -> feat-x) x3
    *   merge master to feat-x
    |\
    | * (tag: expected, master) master1
    | * x2
    | * x1
    |/
    * second commit
    * first commit
  */
  test("commit after merge", async () => {
    copyGitFiles("commit-after-merge");

    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();
    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master1");
  });

  /*
    *   (HEAD -> master2x) merge master to master2x
    |\
    | * (master) master2
    | * master1
    * | (tag: expected, feat-x) x2
    * | x1
    |/
    * first commit
  */
  test("master to catch up branch", async () => {
    copyGitFiles("master-to-catch-up-branch");
    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master2");
  });

  /*
    *
    * (HEAD -> feat-x) x3
    *   merge master to feat-x
    |\
    | * (master) master2
    * |   merge feat-y to feat-x
    |\ \
    | * \   (tag: expected, feat-y) merge master to feat-y
    | |\ \
    | | |/
    | | * master1
    * | | x2
    |/ /
    * | x1
    |/
    * first commit
  */
  test("commit after catch up and merge", async () => {
    copyGitFiles("commit-after-catch-up-and-merge");
    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master2");
  });

  // *   (HEAD -> feat-x) merge master2feat-x to feat-x
  // |\
  // | *   (master2feat-x) merge master to master2feat-x
  // | |\
  // |/ /
  // | * (master) master1
  // * | x2
  // * | x1
  // |/
  // * (tag: expected) second commit
  // * first commit
  test("after merge catch up", async () => {
    copyGitFiles("after-merge-catch-up");
    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master2");
  });

  // * (HEAD -> feat-x) x3
  // *   merge master2feat-x to feat-x
  // |\
  // | *   (master2feat-x) merge master to master2feat-x
  // | |\
  // |/ /
  // | * (tag: expected) (master) master2
  // | * master1
  // * | x2
  // * | x1
  // |/
  // * second commit
  // * first commit
  test("merge catch up and commit", async () => {
    copyGitFiles("merge-catch-up-then-commit");
    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    const expected = execSync("git rev-parse expected", {
      encoding: "utf8",
    }).trim();
    expect(baseHash).toBe(expected);

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("master2");
  });

  // *---.   merge branch11 branch2 branch3 to master
  // |\ \ \
  // | | | * branch3 commit
  // | |_|/
  // |/| |
  // | | * branch2 commit
  // | |/
  // |/|
  // | * branch1 commit
  // |/
  // * (tag: expected) init import
  test("merge multipe commit three", async () => {
    copyGitFiles("merge-multipe-commit-three");
    const gitStrategyPlugin = createGitStrategyPlugin();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    const baseCommitMessage = commitMessageFrom(baseHash);
    expect(baseCommitMessage).toBe("init import");
  });

  test("return characters not included", async () => {
    copyGitFiles("regular-branches-from-develop");
    const gitStrategyPlugin = createGitStrategyPlugin();

    const actualHash = await gitStrategyPlugin.getActualKey();
    const baseHash = await gitStrategyPlugin.getExpectedKey();

    expect(actualHash).not.toContain("\n");
    expect(baseHash).not.toContain("\n");
  });
});
