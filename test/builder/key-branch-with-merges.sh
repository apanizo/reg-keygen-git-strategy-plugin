# *   ce5c3f2 (HEAD -> develop) merge feat-two to develop
# |\  
# | * db63a22 (feat-two) feat two commit 2
# | * f780320 feat two commit 1
# * |   e543801 merge feat-one to develop
# |\ \  
# | |/  
# |/|   
# | * 552677b (feat-one) feat one commit 3
# | * e5a262c feat one commit 1
# * | aacd9a7 feat one commit 2
# * | ef86a6a third commit in develop
# |/  
# * 62fe818 second commit in develop
# * 255b5c2 first commit in develop

cd test
rm -rf fixtures/key-branch-with-merges
git init
git checkout -b develop
git commit --allow-empty -m "first commit in develop"
sleep 1s
git commit --allow-empty -m "second commit in develop"
sleep 1s
git checkout -b feat-one
git commit --allow-empty -m "feat one commit 1"
sleep 1s

git checkout develop
git commit --allow-empty -m "third commit in develop"
sleep 1s

git checkout -b feat-one
git commit --allow-empty -m "feat one commit 2"
sleep 1s

git checkout develop
git checkout -b feat-two
git commit --allow-empty -m "feat two commit 1"
sleep 1s

git checkout feat-one
git commit --allow-empty -m "feat one commit 3"
sleep 1s

git checkout develop
git merge feat-one --no-ff -m "merge feat-one to develop"

git checkout feat-two
git commit --allow-empty -m "feat two commit 2"
sleep 1s

git checkout develop
git merge feat-two --no-ff -m "merge feat-two to develop"

git log --all --decorate --oneline --graph

echo "==================== key-branch-with-merges ===================="
git show-branch -a --sha1-name

mv .git fixtures/key-branch-with-merges
rm -rf .git

