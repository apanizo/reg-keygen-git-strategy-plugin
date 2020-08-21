import path from "path";
import { KeyGeneratorPlugin } from "reg-suit-interface";
import { createLogger, fsUtil } from "reg-suit-util";
import GitStrategyhKeyGenPlugin, { StrategyKeyProps } from "../../index";

export const createGitStrategyPlugin = (): KeyGeneratorPlugin<
  StrategyKeyProps
> => {
  const gitStrategyPlugin = GitStrategyhKeyGenPlugin().keyGenerator;
  const base = path.resolve(fsUtil.prjRootDir(), "test/e2e/.reg");
  gitStrategyPlugin.init({
    coreConfig: {
      actualDir: "__screenshots__",
      workingDir: "test/e2e/.reg",
    },
    logger: createLogger(),
    noEmit: false,
    options: {
      gitLocation: path.resolve(fsUtil.prjRootDir(), "test"),
      referenceBranches: ["develop", "master"],
    },
    workingDirs: {
      base,
      actualDir: path.join(base, "actual"),
      expectedDir: path.join(base, "expected"),
      diffDir: path.join(base, "diff"),
    },
  });

  return gitStrategyPlugin;
};
