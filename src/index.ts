import fs from "fs";
import path from "path";
import {
  KeyGeneratorPlugin,
  PluginCreateOptions,
  KeyGeneratorPluginFactory,
} from "reg-suit-interface";
import { StrategyCommitExplorer } from "./explorer";
import { StrategyKeyProps } from "./types";

class GitStrategyhKeyGenPlugin implements KeyGeneratorPlugin<StrategyKeyProps> {
  private config!: PluginCreateOptions<StrategyKeyProps>;
  private explorer!: StrategyCommitExplorer;

  init(conf: PluginCreateOptions<StrategyKeyProps>): void {
    this.config = conf;
    this.explorer = new StrategyCommitExplorer(conf.options.gitLocation);
  }

  getExpectedKey(): Promise<string> {
    this.checkGit();

    const refBranches = this.config.options.referenceBranches;
    const expandedProtectedBranches = [
      ...refBranches,
      ...refBranches.map((branch) => `origin/${branch}`),
      ...refBranches.map((branch) => `remotes/origin/${branch}`),
    ];

    const baseHash = this.explorer.getBaseCommitHash(
      expandedProtectedBranches,
      this.config.options.log
    );

    return Promise.resolve(baseHash);
  }

  getActualKey(): Promise<string> {
    this.checkGit();

    const currentHash = this.explorer.getCurrentCommitHash();

    return Promise.resolve(currentHash);
  }

  private checkGit = () => {
    try {
      const target = path.join(this.config.options.gitLocation, ".git");
      fs.statSync(target);
    } catch {
      throw new Error("This plugin expects to have a git folder");
    }
  };
}

const pluginFactory: KeyGeneratorPluginFactory = () => {
  return {
    keyGenerator: new GitStrategyhKeyGenPlugin(),
  };
};

// https://www.typescriptlang.org/docs/handbook/modules.html
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
export = pluginFactory;
