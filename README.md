# Acute By — public web pages (GitHub Pages)

This folder is the `acute-by/acute-by.github.io` repository, published at `https://acute-by.github.io/`
(**Settings → Pages → Deploy from branch `main` / root**). Push to `main` and the site updates within a few minutes.

## What the site shows

Two parts: **Games** (`#games`, with `#promise`) and **Websites** (`#websites`): File ICU (https://www.fileicu.com/)
and Health ICU (https://www.health-icu.com/). Every page has a Websites link in the nav and links both websites in the footer; both websites
link back here in their footers. Update the tool counts in `index.html` and `websites.html`, and in all six language tables, when tools are added.

## Languages

English is at the root; French, Spanish, German, Arabic and Urdu are in `/fr/`, `/es/`, `/de/`, `/ar/` and `/ur/`, with the
same six pages. Game privacy policies are English only. Links to File ICU and Health ICU use the same language, and
both sites link back the same way. `fr.html` and its siblings forward `/fr` to `/fr/`. `404.html` shows the visitor's
language and sends translated policy addresses to the English policy. Translated pages are built from the English
pages, so don't edit them by hand: see `D:Tool Site DocsWebsiteAcute ByChangelog.md`.

## Game and app pages

Each game and app has its own page: `/jarlings/`, `/mahjong-sunroom/`, `/paint-parade/`, `/one-touch-survivor/`,
`/chrono-detective/`, `/file-icu-app/` and `/health-icu-app/`, in six languages. They are generated too; see the docs folder.

## Analytics

Google Analytics (G-H8K2FVD06Q) is in `assets/consent.js`, which also holds the privacy choice. It follows the same rules
as File ICU and Health ICU, using the device's time zone because GitHub Pages has no server, and only runs on
`acute-by.github.io`. Game privacy policies must not load this file: the games promise no analytics.

## URLs for the store consoles

| What | HUAWEI AppGallery Connect | Google Play Console / AdMob |
|---|---|---|
| Website / developer site | `https://acute-by.github.io/` | `https://acute-by.github.io/` |
| Jarlings privacy policy | `https://acute-by.github.io/jarlings/privacy-huawei.html` | `https://acute-by.github.io/jarlings/privacy.html` |
| Mahjong Sunroom privacy policy | `https://acute-by.github.io/mahjong-sunroom/privacy-huawei.html` | `https://acute-by.github.io/mahjong-sunroom/privacy.html` |
| Paint Parade privacy policy | `https://acute-by.github.io/paint-parade/privacy-huawei.html` | `https://acute-by.github.io/paint-parade/privacy.html` |
| Terms of use (all games) | `https://acute-by.github.io/terms.html` | `https://acute-by.github.io/terms.html` |
| All privacy policies | `https://acute-by.github.io/privacy.html` | same |
| app-ads.txt | not used (AppGallery builds have no ads) | `https://acute-by.github.io/app-ads.txt` |

Games and apps ship on Android and iOS only. The three `privacy-huawei.html` pages stay online for any build that links to
them, but they are `noindex`, out of the sitemap and not linked from the site. iOS privacy policies do not exist yet and
are needed before App Store submission.

The in-game share text links to `https://acute-by.github.io/#jarlings`, `#mahjong-sunroom` and `#paint-parade`.
When a game goes live, replace its "Coming soon" status line in `index.html` with a link to its store page.
