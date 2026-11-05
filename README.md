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
blocked.json                versions clients must skip (kill switch)
beta/latest.yml             newest beta build for Windows
stable/latest.yml           newest stable build, with its staged-rollout share
catalog/v1/models.json      local AI models listed in Settings → Discover
catalog/v1/extensions.json  extensions (connectors) listed in Discover
catalog/v1/plugins.json     plugins listed in Discover
```

The release workflow in Desuko's private repository writes `beta/` and `stable/`. Edit
`blocked.json` and the `catalog/` files by hand: Desuko checks every catalog file against its
schema and ignores one that doesn't pass (it keeps the list it showed before). Models and
plugins need an `https` URL, an exact `size` and a `sha256`, which Desuko verifies after
downloading. Each `latest*.yml` points at the files of a GitHub Release here.

Making a plugin and getting it listed: [PLUGINS.md](PLUGINS.md).

Use of Desuko is governed by its EULA, shown by the installer and in Settings → About.
