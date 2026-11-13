# Data Updater

To update the phrases database, place the latest `data.txt` from the upstream
McBopomofo project and run `make`.

`make` runs `strip_emoji.js` on the generated `WebData.ts` /
`WebDataPlain.ts` files afterwards, which removes emoji candidates (leaving
plain symbols such as arrows or circled letters untouched) so the packaged
data has no emoji.
