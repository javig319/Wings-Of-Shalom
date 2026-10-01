# Rollback point — midnight-blue palette change (Sept 30, 2026 batch)

The site was wine/burgundy before this change. If the blue palette does not work well,
everything can be restored from the commit immediately **before** it:

    pre-change commit: 1637e01   ("Apply New Edits - Sept 24, 2026 batch")

## Restore the previous look

Revert just the palette commit (keeps later work):

    git revert <palette-commit-sha>

Or restore the exact previous files:

    git checkout 1637e01 -- assets/css/theme.css assets/img/logo.png assets/img/favicon.svg \
      index.html about.html programs.html ministry-journey.html testimonies.html \
      our-team.html worship-flags.html contact.html assets/js/components.js
    git commit -m "Restore wine palette"

## What the change did

* Remapped every wine / burgundy / plum / pink-purple value to a midnight-blue scale
  anchored on the primary **#00092D** (tokens, gradients, shadows, focus ring, nav,
  bands, cards, buttons, links, hover states, footer, favicon, and inline page colours).
* Design-token NAMES were deliberately left unchanged (`--plum-*`, `--lilac-*`,
  `--rose-*`, `--teal-*`) so the change stayed a low-risk value swap rather than a
  rename touching every rule. Their values are now blues.
* Gold accents (`--gold-400/500/600`), fonts, layout, content, images and functionality
  were left untouched.
* Logo replaced with "Wings of Shalom Logo in Deep Blue". The supplied file had an opaque
  deep-blue background, which would have shown as a lighter rectangle against the navy
  header, so the background was keyed out to transparency and the image trimmed and
  resized to 523x300 (1.8 MB -> ~124 KB). Original remains in Google Drive.
