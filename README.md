# TyranoScript 禁則処理補正 plugin 

TyranoScriptにおいて、禁則処理が絡むメッセージ表記が変動する挙動を修正するためのプラグイン。

**注意！！縦書き表示時の動作確認はしていません**

## 使い方

* [こちらから](https://github.com/noymer/tyranoscript-text-line-break/archive/latest.zip)プラグインをダウンロードして下さい。
  以下のようなフォルダ構造になっています。

``` bash
.
├── README.md
└── text_line_break
    ├── index.js
    └── init.ks
```

* `data/others/plugin/` にダウンロードした `text_line_break` フォルダを中身ごと配置してください。
* `first.ks` などで `[plugin name="text_line_break"]` と記述してプラグインを読み込んでください。

## CHANGELOG

* v1.0.0 2019.01 プラグイン作成

## LICENSE

ご自由にお使いください。ライセンス表記は不要です。

https://github.com/noymer/tyranoscript-text-line-break

