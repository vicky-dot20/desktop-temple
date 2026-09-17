# Desktop Temple — private test build 0.10

A Windows desktop companion for a 10–20 day personal trial. Nothing is published and no public release or open-source license has been selected.

## First run

1. Enter a display name on the **demo login** screen. There is no password, real authentication, remote account, or server connection.
2. Choose Ivory Shikhara, Southern Gopuram, Copper Courtyard, Stone Mandap, or one of three reference studies. Previews use the actual 3D models.
3. Open the temple. Change the design later using **Choose temple design…** in the tray menu.

The name and selected design are stored locally in Electron's user-data folder (`setup.json`). Window size and position are in `window.json`; sign-in startup and the last daily entrance are in `startup.json`. These files contain no credentials.

## Daily use

- Double-click the steps to enter. Drag the exterior to move it; drag inside to look around.
- Click the brass plaque's × to **hide** the temple. Reopen from its tray icon or **Desktop Temple** desktop shortcut. Use **Quit Desktop Temple** in the tray menu to exit completely.
- Small, Medium and Large are available from the tray menu. Size, position and exterior view are remembered.
- Transparent lattice openings show the desktop. The interior footprint matches the exterior.
- Select free offerings at the side table. Click the matching brass stand or coconut stone to use them. The same Shiva sculpture appears outside and inside.
- Packaged Windows builds can open at sign-in and enter once per local day. The tray checkbox disables this. Closing or sleeping does not claim another entrance.
- Keep the portable executable in place: the shortcut and startup registration point to it. The installer creates a desktop shortcut too.

## Development

`npm install`, then `npm run desktop`. Browser preview: `npm run dev`.

`npm run package:win` builds the unsigned private installer and portable executable in `release-private`. The temple icon is generated from the source SVG using `npm run icons`.

`npm run package:mac` is configured for a future Mac-hosted build. macOS desktop layering, launch-at-login, signing and native behavior have **not** been verified. Do not distribute it as Mac-ready.

## Checks

- `npm test`: saved preferences, display recovery, daily entrance gate and easing.
- `node tests/rituals.mjs --native`: entrance, four offerings, look controls and long-press behavior. Add `--packaged` to target the unpacked private build.
- `node tests/window-sizes.mjs`: transparent side windows and all three footprint sizes.
- `node tests/lifecycle.mjs`: animated entrance, hide/reopen, settings across restart, simulated suspend/resume handlers and short CPU samples.
- `node tests/onboarding.mjs`: local demo-login gate, previews and selected-design persistence.

Tests use isolated profiles and suppress startup/shortcut registration. Simulated power events do not put the actual computer to sleep.

This is a stylized procedural prototype. The entrance blends two scenes; it is not a single continuous architectural model. Public launch and open-source decisions remain deferred.

## Reference studies

The three additional designs reconstruct visible features of user-supplied images: white marble temple, wide sandstone complex, and brown stone pavilion. They are simplified procedural models, not exact replicas. Hidden elevations, carving detail and proportions are inferred. Original 3D assets or measured drawings are required for exact reproduction. They currently share the existing first-person ritual interior.
