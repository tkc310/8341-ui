# 8341-ui の開発・運用コマンド。`make` で一覧を表示する。
# 中身は pnpm のスクリプト（package.json）を呼ぶだけ。手順の説明は CONTRIBUTING.md・docs/releasing.md。

.DEFAULT_GOAL := help
SHELL := /bin/bash

UI := 8341-ui
TOKENS := 8341-ui-tokens

# 引数（例: make release-publish NPM=1 DRY_RUN=1、make storybook-preview PR=12）
NPM ?=
DRY_RUN ?=
PR ?=

.PHONY: help setup tools install install-ci browsers dev build build-storybook check test verify test-vrt test-e2e \
	tokens palette design-md tw-merge figma registry registry-build generate audit slides slides-check \
	changeset storybook-preview storybook-preview-remove release-version release-publish clean

##@ はじめる

help: ## コマンドの一覧を表示する
	@awk 'BEGIN { FS = ":.*## " } \
		/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } \
		/^[a-zA-Z0-9_-]+:.*## / { printf "  \033[36m%-26s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: tools install ## 初回の準備（道具と依存を入れる）

tools: ## .tool-versions の Node.js・pnpm・gh を入れる（mise か asdf）
	@if command -v mise >/dev/null 2>&1; then mise install; \
	elif command -v asdf >/dev/null 2>&1; then asdf install; \
	else echo "mise か asdf を入れてください（CONTRIBUTING.md の「導入手順」）"; exit 1; fi

install: ## 依存を入れる（トークンも生成される）
	pnpm install

install-ci: ## 依存をロックファイルどおりに入れる（CI 用）
	pnpm install --frozen-lockfile

browsers: ## テスト用のブラウザ（Playwright の Chromium）を入れる
	pnpm --filter 8341-ui-storybook exec playwright install --with-deps chromium

##@ 開発

dev: ## Storybook を起動する（http://localhost:6006）
	pnpm dev

build: ## トークン → コンポーネント（ESM・型・CSS）をビルドする
	pnpm build

build-storybook: ## Storybook とレジストリをビルドする
	pnpm build:storybook

##@ 検査・テスト

check: ## fmt・lint・型・生成物の鮮度・コントラスト・クラス監査・依存の向き
	pnpm check

test: ## 単体テストと、全ストーリーの描画・axe
	pnpm test

verify: check test ## check と test をまとめて実行する（PR を出す前に）

test-vrt: ## 見た目の回帰テスト（手動）
	pnpm test:vrt

test-e2e: ## e2e（320px・強制カラー・ドキュメント。手動）
	pnpm test:e2e

##@ トークン・生成物

tokens: ## トークンの CSS・Tailwind テーマ・Figma JSON を生成する
	pnpm build:tokens

palette: ## palette.config.json から primitive カラーを生成し直す
	pnpm --filter $(TOKENS) palette

design-md: ## DESIGN.md の表をトークンから更新する
	pnpm --filter $(TOKENS) design-md

tw-merge: ## クラス統合の設定（tw-merge-config.ts）を更新する
	pnpm --filter $(TOKENS) tw-merge

figma: ## Figma Variables 用の JSON を書き出す
	pnpm --filter $(TOKENS) figma

registry: ## shadcn の registry.json を更新する
	pnpm --filter $(UI) registry

registry-build: ## レジストリを配信用にビルドする（apps/storybook/public/r）
	pnpm --filter $(UI) registry:build

generate: tokens design-md tw-merge registry ## 生成物をまとめて更新する（トークンやコンポーネントを変えた後に）

audit: ## 健康診断レポートを作る（reports/audit.md）
	pnpm audit:report

##@ スライド

SRC ?=
THEME ?=

slides: ## スライドのデッキを作る（SRC=ソース.html、任意で OUT=出力先 THEME=light|dark|auto）
	@test -n "$(SRC)" || { echo "SRC=スライドのソース（.html）を指定してください"; exit 1; }
	node scripts/slides/build.ts $(SRC) $(if $(OUT),--out $(OUT)) $(if $(THEME),--theme $(THEME))

slides-check: ## スライドのソースを検査する（SRC=ソース.html。無指定なら deck.css と見本）
	node scripts/slides/check.ts $(SRC)

##@ PR・リリース

changeset: ## 変更内容を記録する（公開パッケージを変えたとき）
	pnpm changeset

storybook-preview: ## PR 用の Storybook を Pages に公開する（PR=番号 で指定も可）
	pnpm build:storybook
	cd apps/storybook && node scripts/publish-preview.ts $(if $(PR),--pr $(PR))

storybook-preview-remove: ## PR のプレビューを消す（PR=番号 が必須）
	@test -n "$(PR)" || { echo "PR=番号 を指定してください"; exit 1; }
	cd apps/storybook && node scripts/publish-preview.ts --pr $(PR) --remove

release-version: ## 版を上げる PR を作る（アカウント保有者が手元で）
	node scripts/release.mjs version

release-publish: ## タグ・GitHub Releases・版ごとのレジストリを作る（NPM=1 で npm にも、DRY_RUN=1 で確認だけ）
	node scripts/release.mjs publish $(if $(NPM),--npm) $(if $(DRY_RUN),--dry-run)

# factory:start
##@ デザインシステムファクトリー

CONFIG ?=
OUT ?=

.PHONY: factory
factory: ## 新しいデザインシステムを生成する（CONFIG=設定ファイル OUT=出力先）
	@test -n "$(CONFIG)" -a -n "$(OUT)" || { echo "CONFIG=設定ファイル OUT=出力先 を指定してください"; exit 1; }
	node scripts/factory/create.mjs --config $(CONFIG) --out $(OUT)
# factory:end

##@ 後片付け

clean: ## ビルドの成果物を消す（依存は残す）
	rm -rf packages/*/dist apps/storybook/storybook-static apps/storybook/public/r packages/ui/registry-assets reports
