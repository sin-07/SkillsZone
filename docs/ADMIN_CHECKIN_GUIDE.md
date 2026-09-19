# ColonyGames Gate Check-in & Scanner Operational Guide

## Gate Setup
1. **Device Preparation**: Any smartphone, tablet, or laptop with a working web camera.
2. **URL**: Navigate to `https://skills-zone.vercel.app/admin` (or `http://localhost:3000/admin`).
3. **Login**: Use authorized committee credentials.
4. **Permissions**: Allow camera access when prompted by the browser.

## Check-in Procedures
1. Direct the resident to display their printed pass or mobile confirmation screen.
2. Align the pass QR code within the highlighted viewfinder box.
3. The scanner performs instant cryptographic verification:
   - **Green Badge**: Valid registration. Displays family name, tower, and registered athletes.
   - **Audio Tone**: High beep confirms successful entry logging.
   - **Yellow/Red Warning**: Pass already checked in previously (prevents double entry).
4. For physical passes with barcode damage, use the **Manual Ticket Lookup** input to type the 6-character registration ID (e.g. `CG2026-TWR-A-042`).
5. Hand out ColonyGames athlete jersey kits based on the t-shirt sizes shown on the screen.
