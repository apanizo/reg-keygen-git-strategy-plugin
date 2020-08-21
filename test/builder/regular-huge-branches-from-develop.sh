# * be190ad (HEAD -> feat-one) feat one commit 200
# * 9e8a050 feat one commit 199
# * f36c665 feat one commit 198
# * 0c515de feat one commit 197
# ....................................
# * 322abd0 feat one commit 3
# * 2179eea feat one commit 2
# * f0789c9 feat one commit 1
# | * 175d2b0 (feat-two) feat two commit 2
# | * a48ef42 feat two commit 1
# | * acaf603 (develop) fourth commit in develop
# | * b2eed69 third commit in develop
# |/  
# * 79178fd second commit in develop
# * 230fef1 first commit in develop

cd test
rm -rf fixtures/regular-huge-branches-from-develop
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

for i in {4..200}
do
  git commit --allow-empty -m "feat one commit $i"
  sleep 0.1s
done

echo "==================== regular-huge-branches-from-develop ===================="
git show-branch -a --sha1-name

mv .git fixtures/regular-huge-branches-from-develop
rm -rf .git
