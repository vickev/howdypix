YARN := yarn --silent

new-version:
	#git pull --rebase
	$(YARN) lerna version --conventional-commits --no-push
