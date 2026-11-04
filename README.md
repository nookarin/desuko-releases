# Desuko releases

Installers and the in-app update feed for **Desuko**, an AI desktop companion. Desuko is closed
source; this repository holds no source code.

## Download

Get the latest version from [Releases](https://github.com/nookarin/desuko-releases/releases/latest).

| System | File |
|---|---|
| Windows 10/11 (x64) | `Desuko-Setup-<version>.exe` |

Linux builds aren't available yet.

Builds marked **Pre-release** are on the beta channel. Desuko updates itself after installation
(Settings → About → Update channel).

## What's in this repository

GitHub Pages serves this branch as the update feed at
`https://nookarin.github.io/desuko-releases`:

```
blocked.json            versions clients must skip (kill switch)
beta/latest.yml         newest beta build for Windows
stable/latest.yml       newest stable build, with its staged-rollout share
```

The release workflow in Desuko's private repository writes these files; edit only
`blocked.json` by hand. Each `latest*.yml` points at the files of a GitHub Release here.

Use of Desuko is governed by its EULA, shown by the installer and in Settings → About.
