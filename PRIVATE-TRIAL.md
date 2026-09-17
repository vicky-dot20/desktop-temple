# Private trial notes

Use normally for 10–20 days. If something feels wrong, note the day, chosen layout, size, what you clicked, and a screenshot if useful.

Things to observe naturally:
- First login and changing between all four exteriors.
- Sign-in after an actual shutdown: temple opens and daily entrance happens once.
- Real sleep/wake and lock/unlock: position stays correct, hidden temple stays hidden.
- Hide, tray reopen, desktop shortcut and complete quit/relaunch.
- Switching displays/scaling and moving the temple away from the bottom-right.
- All offerings, looking through side windows, and Small/Medium/Large.
- Whether the temple distracts, consumes noticeable battery, or feels too large.

## Later release decision — intentionally not activated

No signing certificate, Apple Developer identity or Mac is available. The current private build is unsigned. No publishing, repository upload or license decision has been made.

For a future Windows launch, supply signing credentials securely to the build environment, enable executable signing (currently disabled for private tests), require code signing, and verify the installed binary's signature. The installer is configured to create a desktop shortcut and embeds the temple icon.

For a future Mac launch, build on a Mac, supply Developer ID signing and notarization credentials, then test desktop layering, transparent windows, startup, reopen, Apple Silicon/Intel support and Gatekeeper on actual devices. The config selects the installed Electron distribution only on Windows so it does not reuse a Windows runtime for a Mac build.

Reference docs: https://www.electron.build/code-signing.html and https://www.electronjs.org/docs/latest/api/power-monitor
