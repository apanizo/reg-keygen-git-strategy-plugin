# * e62bc6b (HEAD -> feat-one-v2) feat one v2 commit 3
# * 200ff76 feat one v2 commit 2
# * 5087583 feat one v2 commit 1
# | * 3bc16ea (feat-two) feat two commit 2
# | * 5f2e1a0 feat two commit 1
# | * d042d37 (develop) fourth commit in develop
# | * 9ee8583 third commit in develop
# | | * 26edcfc (feat-one) feat one commit 4
# | |/  
# |/|   
# * | 98c2c23 feat one commit 3
# * | 504fd07 feat one commit 2
# * | b90e720 feat one commit 1
# |/  
# * 8992ce2 second commit in develop
# * 42f19a1 first commit in develop

cd test
rm -rf fixtures/branch-of-regular-feat-branch
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

git log --all --decorate --oneline --graph

echo "==================== branch-of-regular-feat-branch ===================="
git show-branch -a --sha1-name

mv .git fixtures/branch-of-regular-feat-branch
rm -rf .git

