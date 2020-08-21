#  Merge made by the 'recursive' strategy.
#   *   d115009 (HEAD -> feat-one) Merge branch 'feat-one-v2' into feat-one
#   |\  
#   | * 1e21716 (feat-one-v2) feat one v2 commit 3
#   | * c142129 feat one v2 commit 2
#   | * d7dac5f feat one v2 commit 1
#   * | 48df815 feat one commit 4
#   |/  
#   * d78098e feat one commit 3
#   * 4fdae96 feat one commit 2
#   * b52a465 feat one commit 1
#   | * 0db7e73 (feat-two) feat two commit 2
#   | * 6f452a1 feat two commit 1
#   | * 17bcb17 (develop) fourth commit in develop
#   | * 02e78bb third commit in develop
#   |/  
#   * 7a53d68 second commit in develop
#   * f3b35bf first commit in develop

cd test
rm -rf fixtures/regular-branches-with-merges-from-develop
git init
git checkout -b develop
git commit --allow-empty -m "first commit in develop"
sleep 1s
git commit --allow-empty -m "second commit in develop"
sleep 1s
git checkout -b feat-one
git commit --allow-empty -m "feat one commit 1"
sleep 1s
git commit --allow-empty -m "feat one commit 2"
sleep 1s

git checkout develop
git commit --allow-empty -m "third commit in develop"
sleep 1s

git checkout feat-one
git commit --allow-empty -m "feat one commit 3"
sleep 1s

git checkout develop
git commit --allow-empty -m "fourth commit in develop"
sleep 1s

git checkout -b feat-two
git commit --allow-empty -m "feat two commit 1"
sleep 1s

git checkout feat-one
git checkout -b feat-one-v2

git commit --allow-empty -m "feat one v2 commit 1"
sleep 1s
git commit --allow-empty -m "feat one v2 commit 2"
sleep 1s

git checkout feat-one 
git commit --allow-empty -m "feat one commit 4"
sleep 1s

git checkout feat-two
git commit --allow-empty -m "feat two commit 2"
sleep 1s

git checkout feat-one-v2
git commit --allow-empty -m "feat one v2 commit 3"
sleep 1s

git checkout feat-one
git merge feat-one-v2 --no-ff -m "merge feat-one-v2 to feat-one"
sleep 1s

git log --all --decorate --oneline --graph

echo "==================== regular-branches-with-merges-from-develop ===================="
git show-branch -a --sha1-name

mv .git fixtures/regular-branches-with-merges-from-develop
rm -rf .git

