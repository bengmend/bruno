<br />
<img src="assets/images/logo-transparent.png" width="80"/>

### Bruno - APIテスト・オープンソースIDE for exploring and testing APIs.

[![GitHub version](https://badge.fury.io/gh/usebruno%2Fbruno.svg)](https://badge.fury.io/gh/usebruno%bruno)
[![CI](https://github.com/usebruno/bruno/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/usebruno/bruno/workflows/unit-tests.yml)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/usebruno/bruno)](https://github.com/usebruno/bruno/pulse)
[![X](https://img.shields.io/twitter/follow/use_bruno?style=social&logo=x)](https://twitter.com/use_bruno)
[![Website](https://img.shields.io/badge/Website-Visit-blue)](https://www.usebruno.com)
[![Download](https://img.shields.io/badge/Download-Latest-brightgreen)](https://www.usebruno.com/downloads)

[English](../../readme.md) | [Українська](docs/readme/readme_ua.md) | [Русский](docs/readme/readme_ru.md) | [Türkçe](docs/readme/readme_tr.md) | [Deutsch](docs/readme/readme_de.md) | [Français](docs/readme/readme_fr.md) | [Português (BR)](docs/readme/readme_pt_br.md) | [한국어](docs/readme/readme_kr.md) | [বাংলা](docs/readme/readme_bn.md) | [Español](docs/readme/readme_es.md) | [Italiano](docs/readme/readme_it.md) | [Română](docs/readme/readme_ro.md) | [Polski](docs/readme/readme_pl.md) | [简体中文](docs/readme/readme_cn.md) | [正體中文](docs/readme/readme_zhtw.md) | **日本語**

<!-- Bruno is a new and innovative API client, aimed at revolutionizing the status quo represented by Postman and similar tools out there. -->
Brunoは新しく革新的なAPIクライアントです。Postmanやその類似ツールの現状を変えていくことを目指しています。

<!-- Bruno stores your collections directly in a folder on your filesystem. We use a plain text markup language, Bru, to save information about API requests. -->
Brunoはあなたの使用しているファイルシステム上のフォルダに直接コレクションを保存します。APIリクエストの情報を保存するためにBruというプレーンテキストのマークアップ言語を採用しています。

<!-- You can use Git or any version control of your choice to collaborate over your API collections. -->
APIコレクションを共有するためにGitや任意のバージョン管理システムを使用できます。

<!-- Bruno is offline-only. There are no plans to add cloud-sync to Bruno, ever. We value your data privacy and believe it should stay on your device. Read our long-term vision [here](https://github.com/usebruno/bruno/discussions/269) -->
Brunoはオフラインでの使用に完結できます。Brunoにクラウド同期機能を追加する予定はありません。私たちはデータプライバシーを尊重していて、データはデバイス上に保存されるべきだと考えています。私たちの長期的なビジョンは[こちら](https://github.com/usebruno/bruno/discussions/269)をご覧ください。

[Brunoをダウンロード](https://www.usebruno.com/downloads)

<!-- 📢 Watch our recent talk at India FOSS 3.0 Conference [here](https://www.youtube.com/watch?v=7bSMFpbcPiY) -->
📢 India FOSS 3.0 Conferenceでの発表の様子は[こちら](https://www.youtube.com/watch?v=7bSMFpbcPiY)から

![bruno](assets/images/landing-2.png) <br /><br />

### ゴールデンエディション ✨

<!-- Majority of our features are free and open source.
We strive to strike a harmonious balance between [open-source principles and sustainability](https://github.com/usebruno/bruno/discussions/269) -->
機能のほとんどが無料で使用でき、オープンソースとなっています。
私たちは[オープンソースの原則と持続可能性](https://github.com/usebruno/bruno/discussions/269)の間でうまくバランスを取ろうと努力しています。

<!-- You can buy the [Golden Edition](https://www.usebruno.com/pricing) for a one-time payment of **$19** ! <br/> -->
[ゴールデンエディション](https://www.usebruno.com/pricing)を **19ドル** (買い切り)で購入できます！

### インストール方法

<!-- Bruno is available as binary download [on our website](https://www.usebruno.com/downloads) for Mac, Windows and Linux. -->
Brunoは[私たちのウェブサイト](https://www.usebruno.com/downloads)からバイナリをダウンロードできます。Mac, Windows, Linuxに対応しています。

<!-- You can also install Bruno via package managers like Homebrew, Chocolatey, Scoop, Snap, Flatpak and Apt. -->
Homebrew, Chocolatey, Scoop, Snap, Flatpak, Aptなどのパッケージマネージャからもインストール可能です。

```sh
# MacでHomebrewを使ってインストール
brew install bruno

# WindowsでChocolateyを使ってインストール
choco install bruno

# WindowsでScoopを使ってインストール
scoop bucket add extras
scoop install bruno

# Windowsでwingetを使ってインストール
winget install Bruno.Bruno

# LinuxでSnapを使ってインストール
snap install bruno

# LinuxでFlatpakを使ってインストール
flatpak install com.usebruno.Bruno

# LinuxでAptを使ってインストール
sudo mkdir -p /etc/apt/keyrings
sudo gpg --no-default-keyring --keyring /etc/apt/keyrings/bruno.gpg --keyserver keyserver.ubuntu.com --recv-keys 9FA6017ECABE0266

echo "deb [signed-by=/etc/apt/keyrings/bruno.gpg] http://debian.usebruno.com/ bruno stable" | sudo tee /etc/apt/sources.list.d/bruno.list

sudo apt update
sudo apt install bruno
```

### マルチプラットフォームでの実行に対応 🖥️

![bruno](assets/images/run-anywhere.png) <br /><br />

### Gitとの連携が可能 👩‍💻🧑‍💻

または任意のバージョン管理システムにも対応

![bruno](assets/images/version-control.png) <br /><br />

### スポンサー

#### ゴールドスポンサー

<img src="assets/images/sponsors/samagata.png" width="150"/>

#### シルバースポンサー

<img src="assets/images/sponsors/commit-company.png" width="70"/>

#### ブロンズスポンサー

<a href="https://zuplo.link/bruno">
    <img src="assets/images/sponsors/zuplo.png" width="120"/>
</a>

### 主要リンク 📌

- [私たちの長期ビジョン](https://github.com/usebruno/bruno/discussions/269)
- [ロードマップ](https://github.com/usebruno/bruno/discussions/384)
- [ドキュメント](https://docs.usebruno.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/bruno)
- [ウェブサイト](https://www.usebruno.com)
- [料金設定](https://www.usebruno.com/pricing)
- [ダウンロード](https://www.usebruno.com/downloads)
- [Githubスポンサー](https://github.com/sponsors/helloanoop).

### Showcase 🎥

- [体験談](https://github.com/usebruno/bruno/discussions/343)
- [ナレッジベース](https://github.com/usebruno/bruno/discussions/386)
- [スクリプト集](https://github.com/usebruno/bruno/discussions/385)

### サポート ❤️

<!-- If you like Bruno and want to support our opensource work, consider sponsoring us via [Github Sponsors](https://github.com/sponsors/helloanoop). -->
もしBrunoを気に入っていただいて、オープンソースの活動を支援していただけるなら、[Github Sponsors](https://github.com/sponsors/helloanoop)でスポンサーになることを考えてみてください。

### 体験談のシェア 📣

<!-- If Bruno has helped you at work and your teams, please don't forget to share your [testimonials on our GitHub discussion](https://github.com/usebruno/bruno/discussions/343) -->
Brunoが職場やチームで役立っているのであれば、[GitHub discussion上であなたの体験談](https://github.com/usebruno/bruno/discussions/343)をシェアしていただくようお願いします。

### 新しいパッケージマネージャへの公開

詳しくは[こちら](../publishing/publishing_ja.md)をご覧ください。

### 連絡先 🌐

[𝕏 (Twitter)](https://twitter.com/use_bruno) <br />
[Website](https://www.usebruno.com) <br />
[Discord](https://discord.com/invite/KgcZUncpjq) <br />
[LinkedIn](https://www.linkedin.com/company/usebruno)

### 商標について

**名前**

`Bruno`は[Anoop M D](https://www.helloanoop.com/)は取得している商標です。

**ロゴ**

ロゴの出典は[OpenMoji](https://openmoji.org/library/emoji-1F436/)です。CC [BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)でライセンスされています。

### 貢献するには 👩‍💻🧑‍💻

<!-- I am happy that you are looking to improve bruno. Please check out the [contributing guide](contributing.md) -->
Brunoを改善していただけるのは歓迎です。[コントリビュートガイド](../contributing/contributing_ja.md)をご覧ください。

<!-- Even if you are not able to make contributions via code, please don't hesitate to file bugs and feature requests that needs to be implemented to solve your use case. -->
もしコードによる貢献ができない場合でも、あなたのユースケースを解決するために遠慮なくバグ報告や機能リクエストを出してください。

### 開発者

<div align="center">
    <a href="https://github.com/usebruno/bruno/graphs/contributors">
        <img src="https://contrib.rocks/image?repo=usebruno/bruno" />
    </a>
</div>

### ライセンス 📄

[MIT](license.md)
