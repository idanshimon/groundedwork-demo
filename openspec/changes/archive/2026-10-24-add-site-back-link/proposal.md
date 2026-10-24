# Add a way back to the site from the playground

## Why

The playground at idanshimon.github.io/groundedwork-demo/ had no link back to
idanshimon.github.io. Visitors arriving from the homepage, a blog post or the
groundedwork project page had to use the browser back button.

## What Changes

- Header gets a small back link above the groundedwork mark.
- The link returns to the page on idanshimon.github.io the visitor came from,
  labelled with that page's name ("Home" for the root).
- With no same-site referrer (direct visit, external link), it goes to the
  groundedwork project page.

## Impact

- `index.html` only. Shipped in PR #3.
