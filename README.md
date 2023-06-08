# @tokiumjp/arch
## 概要
ソースコードの配置を管理するツールです。
arch.ymlで定義した構をもとに、違反しているファイル・ディレクトリを検出します。

```yml
- directory: src
  description: ソースコードのルートディレクトリです。
  allow: all
  subdirectories:
    - directory: controllers
      description: コントローラーに関するディレクトリです。
      allow: subdirectories
      subdirectories:
        - directories: users
          description: ユーザーに関するコントローラーです。
          allow: files
```

このymlに対して、実際には下記のようなディレクトリ構成があったとします。
```bash
- src
  - controllers
    - users
      - index.js
      - show.js
      - edit.js
    - posts
      - index.js
      - show.js
      - edit.js
```

この場合、posts配下はarch.ymlで定義されていないため、エラーが発生します。
```bash
$ arch check --config arch.yml --input .

Invalid files:
- src/controllers/posts/index.js
- src/controllers/posts/show.js
- src/controllers/posts/edit.js
```

## 使い方
ツールはgithub packagesに公開しています。下記のコマンドでインストールしてください。
```bash
$ npm config set @tokium:registry https://npm.pkg.github.com
$ npm login --registry=https://npm.pkg.github.com --scope=@tokium
$ npm install -g @tokium/arch
```

### check
checkコマンドで、指定したアーキテクチャ定義のyamlファイルと、実際のファイル配置をチェックすることができます。
inputにはディレクトリ・ファイルを指定でき、ディレクトリを指定した場合は配下のファイルを再帰的にチェックします。
```bash
$ arch check --config <path/to/arch.yml> --input <path/to/dir>
```

## 開発
### 環境構築
devcontainerを用意しています。vscodeの`Remote-Containers`拡張をインストールして、`Remote-Containers: Reopen Folder in Container`を実行すると、開発環境が構築されます。
