# * a8eb99e (HEAD -> feat-one) feat one commit 4
# * 5a8b9e5 feat one commit 3
# * 5d85df0 feat one commit 2
# * 156d37a feat one commit 1
# | * fb3ed3a (feat-two) feat two commit 2
# | * 40a0978 feat two commit 1
# | * 2a82bea (develop) fourth commit in develop
# | * dde40a7 third commit in develop
# |/  
# * c3cfd4e second commit in develop
# * 2d45426 first commit in develop

cd test
rm -rf fixtures/regular-branches-from-develop
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
git commit --allow-empty -m "feat two commit 2"
sleep 1s

git checkout feat-one
git commit --allow-empty -m "feat one commit 4"
sleep 1s

git log --all --decorate --oneline --graph

echo "==================== regular-branches-from-develop ===================="
git show-branch -a --sha1-name

mv .git fixtures/regular-branches-from-develop
rm -rf .git

