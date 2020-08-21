import fs from "fs";
import path from "path";
import { KeyGeneratorPlugin, PluginCreateOptions } from "reg-suit-interface";
import { StrategyCommitExplorer } from "./explorer";

export interface StrategyKeyProps {
  gitLocation: string;
  referenceBranches: string[];
}

class GitStrategyhKeyGenPlugin implements KeyGeneratorPlugin<StrategyKeyProps> {
  private config!: PluginCreateOptions<StrategyKeyProps>;
  private explorer!: StrategyCommitExplorer;

  init(conf: PluginCreateOptions<StrategyKeyProps>): void {
    this.config = conf;
    this.explorer = new StrategyCommitExplorer(conf.options.gitLocation);
  }

  getExpectedKey(): Promise<string> {
    this.checkGit();

    const baseHash = this.explorer.getBaseCommitHash(
      this.config.options.referenceBranches
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

export default () => {
  return {
    keyGenerator: new GitStrategyhKeyGenPlugin(),
  };
};
