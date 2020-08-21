# reg-keygen-git-strategy-plugin

A reg-suit plugin to detect base and actual commit hashes accomplishing:

- OBJECTIVE 1: Local comparison when you are on a regular branch
- OBJECTIVE 2: Global comparision when you are in a protected branch

## OBJECTIVE 1 :: Local comparision

Basically what we want to achieve here is to compare the changes you have implemented in your actual branch against the first commit belonging to protected branches (i.e master, develop). It is important to remark we filter commits from other feature branches.

## OBJECTIVE 2 :: Global comparision

Once our MR is merged, just in case other branches were merged before, we need to check images comparing with the first commit available having snapshots for avoiding or missing changes. This is done using --first-parent technique which filters commits merged from branches and only shows merge commits and regular commits done on the marked secured branch.

## Usage

```sh
yarn add -D reg-keygen-git-strategy-plugin
```

Include it in your reg-viz config file

```
 "core": {
   ...
 },
 "plugins: {
   "reg-keygen-git-strategy-plugin": {
     gitLocation: '',
     referenceBranches: ['master', 'develop'],
   }
   ...
 }
```

## Dev

You just need to install dependencies, then generate your test git folders, and finally run them:

```
yarn install
yarn gen:fixtures
yarn test
```

## API

### gitLocation

**string (required)** :: Indicates the location of the git folder. If you have the .git folder in the root of your project. Example:

```
options: {
  gitLocation: '', # .git folder is in the root
  gitLocation: 'test/e2e', # git folder's location path.resolve(projRootDir, "test/e2e")
  ...
}
```

### referenceBranches

**string[](required)** :: Those are the main branches in your repo, needed for accomplish OBJECTIVE 2

```
options: {
  referenceBranches: ['master', 'develop']
}
```

## LICENSE

See [LICENSE.MD](/LICENSE.md)
