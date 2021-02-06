# フロントエンド課題
## 使用した技術要素
* react ^16.10.2
* @material-ui/core ^4.5.1
* @material-ui/icons ^4.5.1
* @material-ui/styles ^4.5.0
* axios ^0.19.0
* json-server ^0.15.1
* material-ui-image ^3.2.2
* react-router-dom ^5.1.2

## 設計・構成
### ルーティング
| URL  | 詳細  |
|---|---|
|/   |   |
|/new   |   |
|/detail/:id   |   |
|/edit/:id   |   |
|/items/search/   |   |

## 開発環境のセットアップ
##### nodeをインストール
バージョンは「v11.6.0」を利用 - 参考記事 https://qiita.com/akakuro43/items/600e7e4695588ab2958d

##### 任意の階層でアプリケーションをBitbucketからクローン
```
$ git clone git@bitbucket.org:teamlabengineering/chiharu-front.git
```

##### ディレクトリに移動
```
$ cd chiharu-front
```

##### パッケージをインストール
```
$ npm install
```

##### アプリケーション起動
```
$ npm start
```
→ `localhost:3000`でフロントアプリケーションの起動確認
