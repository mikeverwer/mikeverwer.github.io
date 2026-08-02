# PageMaker + GitHub Actions: automated build & deploy

This documents how `mikeverwer.github.io` is built and deployed automatically
on every push, using the existing PageMaker tool headlessly instead of
running it by hand.

## Files this setup adds

All four of these live together in a `_site_building/` subfolder at the repo
root:

| File | Purpose |
|---|---|
| `_site_building/pagemaker_core.py` | `PersonalSitePage`, extracted unchanged from `main.pyw`'s GUI class — no Tkinter/PIL/sv_ttk/ctypes dependency, safe to run on a CI runner. |
| `_site_building/build_site.py` | Headless equivalent of `PageMaker.make_files()`. Reads a saved PageMaker JSON config and drives `PersonalSitePage` directly, no GUI involved. |
| `_site_building/html_reformat.py` | Unchanged — already GUI-free, only used `html`/`re`/`sys`/`bs4`. |
| `_site_building/site_config.json` | Your existing PageMaker "Save Config" output — the single source of truth for all page definitions. **Not edited for CI** (see below). |
| `.github/workflows/deploy.yml` | Runs the build and deploys the result to GitHub Pages on every push to `main`. |

`build_site.py` imports `pagemaker_core`, which in turn imports
`html_reformat` — both plain module imports with no path in the `import`
statement. Python adds the invoked script's own directory to the module
search path automatically, so keeping all three `.py` files together in
`_site_building/` is what makes those imports resolve correctly regardless
of where the command is run *from*.

`main.pyw` (the Tkinter GUI app) lives in its own separate repo and is
untouched by any of this.

## How PageMaker actually builds pages (the part that was confusing)

There's no separate "build output" folder. `PersonalSitePage` writes each
page directly into the site tree using one formula:

```
output_file_path = f"{root}{path_to_page}{output_filename}.html"
```

- `root` = `project_data.root` in the config — for this project, `root` is
  the entire repo, not a staging subfolder.
- `path_to_page` = a row's `"path -insert"`, cleaned to always start/end
  with `/` (an empty string becomes just `/`).
- `output_filename` = a row's `"html filename -insert"`.

Examples traced from `full-site.json` against the real repo tree:

| `path -insert` | `html filename -insert` | Resulting file |
|---|---|---|
| `/apps/` | `coin_flip` | `apps/coin_flip.html` |
| `""` (→ `/`) | `index` | `index.html` |
| `/projects/ad_posting_db/` | `ad_posting_procedures` | `projects/ad_posting_db/ad_posting_procedures.html` |

**Because `mikeverwer.github.io` is a user-page repo, the file tree *is* the
URL tree** — GitHub serves the repo root as `https://mikeverwer.github.io/`
directly, with no translation step. The sitemap's `<loc>` entries are built
with this exact same `path_to_page` value, so the sitemap and the on-disk
location always agree.

One more dependency worth knowing: `change_article()` doesn't embed markdown
content at build time — it writes a `src="/assets/docs/..."`-style attribute
into the HTML, and something client-side fetches that `.md` file in the
browser. So the deployed site needs `assets/docs/*.md`, `assets/images/`,
`styles/`, and `js/` alongside the generated HTML, not just the `.html`
files themselves.

## Why `site_config.json` doesn't need to change

The saved config has absolute Windows paths:
```json
"root": "D:/Projects/Code/Website/mikeverwer.github.io",
"template": "D:/Projects/Code/Website/mikeverwer.github.io/teaching.html"
```
These don't exist on a Linux CI runner. Rather than edit the config (which
PageMaker itself manages), `build_site.py` accepts override flags:

```bash
python _site_building/build_site.py --config _site_building/site_config.json --root . --template teaching.html
```

`--root .` and `--template teaching.html` are only used in CI; your local
PageMaker GUI workflow and saved config are unaffected.

## What the workflow does, step by step

1. Checks out the repo fresh.
2. Installs Python + `beautifulsoup4`.
3. Runs `_site_building/build_site.py` with `--root .` — this regenerates
   every page's `.html` file **in place** in the checkout, the same way
   running PageMaker locally would.
4. Stages a clean copy of the checkout into a throwaway `_site/` folder via
   `rsync`, **excluding** the build tooling itself (`.git`, `.github`,
   `__pycache__`, `_site_building`, `tests`). This step exists because
   `actions/upload-pages-artifact` deploys one directory verbatim with no
   exclude option — building in place means the checkout also contains
   files that shouldn't be public. Keeping all the build files together in
   one folder is what keeps this exclude list to one line instead of one
   per file.
5. Uploads `_site/` as the Pages artifact.
6. Deploys it via `actions/deploy-pages`.

If you add other dev-only files or folders later, add another
`--exclude='...'` line to the `rsync` step in `deploy.yml`.

## One-time setup steps (do these once)

1. Commit the `_site_building/` folder (containing `pagemaker_core.py`,
   `build_site.py`, `html_reformat.py`, `site_config.json`) and
   `.github/workflows/deploy.yml` to the repo, then push.
2. On GitHub: **Settings → Pages → Build and deployment → Source** — change
   from *"Deploy from a branch"* to **"GitHub Actions"**. This is the part
   that's easy to miss — without it, GitHub ignores the workflow's deploy
   step entirely.

## Testing before you trust CI

Run the same build command locally first, so any errors show up with a full
local stack trace instead of buried in Actions logs. Run it from the **site
repo root** (not from inside `_site_building/`) — `--root .` and `--config`
are both resolved against whatever directory you're standing in when you run
the command, not against where `build_site.py` itself lives:

```powershell
cd D:/Projects/Code/Website/mikeverwer.github.io
pip install beautifulsoup4
python _site_building/build_site.py --config _site_building/site_config.json --root . --template teaching.html
```

(Watch the `beautifulsoup4` spelling — `beautifysoup4` will fail to
install.)

This is exactly what CI does too: the workflow never `cd`s into
`_site_building/`, it runs the script from the checkout root the same way.

Check the regenerated pages against what PageMaker's GUI currently produces
before relying on the CI version.

## Should `pagemaker_core.py` / `build_site.py` also live in the PageMaker repo?

`build_site.py` — no. Its only job is driving a headless build inside the
*site* repo; PageMaker's own GUI calls `make_files()` directly and has no
use for it.

`pagemaker_core.py` is more of a real tradeoff. `PersonalSitePage` currently
exists in two places: inline inside `main.pyw` in the PageMaker repo, and as
the extracted copy in `_site_building/` here (identical except for the
`log()` null-check patch). If you ever edit `PersonalSitePage` in one place
— add a new SEO field, fix a bug in `change_article`, etc. — the other copy
silently falls out of sync, and CI would keep building pages slightly
differently from what the GUI produces without any error to tell you so.

Two ways to handle it, in order of effort:
- **Cheapest:** whenever you change `PersonalSitePage` in `main.pyw`, copy
  the changed method(s) into `_site_building/pagemaker_core.py` by hand. Low
  effort if the class itself changes rarely compared to how often you edit
  content.
- **Cleaner:** move `PersonalSitePage` out of `main.pyw` entirely into its
  own `pagemaker_core.py` inside the *PageMaker* repo, have `main.pyw`
  import it from there, and treat that copy as canonical — then copy that
  one file into `_site_building/` here whenever it changes, instead of
  copying methods out of a GUI file. Same manual-copy step either way,
  but it separates "the engine" from "the GUI" cleanly in both repos.

Neither is automatic without wiring up something like a git submodule or a
small local pip package shared between the two repos — worth doing only if
this class ends up changing often enough that manual copying becomes
annoying.

## Ongoing usage

Edit content in PageMaker as usual → **Save Config** → commit the updated
`site_config.json` (plus any changed templates/markdown/assets) → push. The
workflow rebuilds every page and redeploys automatically. No need to run
PageMaker's GUI just to publish — only to edit.

## Fixes made to the original code for headless compatibility

- **`ctypes.windll.shell32...` (main.pyw, module level):** Windows-only API
  called at import time — would crash immediately on a Linux runner. Not an
  issue for `pagemaker_core.py` since it doesn't import `main.pyw` at all,
  only the extracted `PersonalSitePage` class.
- **`PersonalSitePage.log()`:** originally assumed `self.logging_text` was a
  live Tkinter `Text` widget and was called on every build step, not just
  errors — passing `logger=None` crashed immediately. Patched to skip the
  widget calls when `logger` is `None`, while still printing either way and
  still working identically from the GUI.
- **Hardcoded path separators:** the original `make_sitemap` used a literal
  backslash (`f"{root_path}\\sitemap.xml"`) while `robots.txt` used a forward
  slash — inconsistent and Windows-specific. `build_site.py`'s
  `make_sitemap()`/`write_robots()` use `pathlib.Path` instead, which works
  the same on Linux and Windows.
