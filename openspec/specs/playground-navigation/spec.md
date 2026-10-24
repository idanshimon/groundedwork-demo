# playground-navigation Specification

## Purpose
TBD - created by archiving change add-site-back-link. Update Purpose after archive.
## Requirements
### Requirement: Way back to the site

The playground MUST show a link back to idanshimon.github.io in its header.

#### Scenario: arrived from a page on the site

- **GIVEN** the visitor opened the playground from a page on idanshimon.github.io
- **WHEN** they click the back link
- **THEN** they MUST return to that page
- **AND** the link label MUST name that page, or read "Home" for the site root

#### Scenario: arrived directly

- **GIVEN** the visitor opened the playground with no referrer from the site
- **WHEN** they click the back link
- **THEN** they MUST go to the groundedwork project page on idanshimon.github.io

