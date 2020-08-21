cd test
rm -rf fixtures/no-commits
git init

echo "==================== no-commits ===================="
mv .git fixtures/no-commits
rm -rf .git
