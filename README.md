# Vedic Jyotish Agent Skill

`read-vedic-jyotish` calculates a Lahiri sidereal Vedic chart locally and
guides an agent through a detailed, evidence-grounded traditional reading.
Birth details are not sent to a project-owned server.

## Ask GitHub Copilot to install it

Paste this into GitHub Copilot Agent mode or Copilot CLI:

> Use GitHub CLI 2.90 or later. Run
> `gh skill preview lavish0000/vedic-jyotish-skill read-vedic-jyotish`.
> After I approve the preview, run
> `gh skill install lavish0000/vedic-jyotish-skill read-vedic-jyotish --agent github-copilot --scope user`.
> Reload skills if the current session requires it, then use
> `/read-vedic-jyotish` to give me a detailed Vedic Jyotish reading. Ask me
> only for missing birth details.

For a Hinglish reading, add: `Reply in natural Hinglish written in English
letters.`

If manual installation is preferred, GitHub CLI 2.90 or later supports:

```bash
gh skill preview lavish0000/vedic-jyotish-skill read-vedic-jyotish
gh skill install lavish0000/vedic-jyotish-skill read-vedic-jyotish \
  --agent github-copilot --scope user
```

The first calculation may require approval to run the bundled local script.
No external model key or hosted calculation service is required.
This project does not retain birth profiles or receive chart requests. The
calculator does not send the birth date, time, or chart to a project-owned
service. The host handles conversation data under its own privacy settings.
If coordinates are not supplied, the calculator additionally sends only the
birthplace search text to Open-Meteo for place resolution.

## Method

- Lahiri sidereal ayanamsha
- whole-sign houses
- mean Rahu and opposite Ketu
- Swiss Ephemeris 2.10.03 with built-in Moshier data
- Vimshottari dasha with a 365.25-day year
- explicit supporting factors, counter-signals, confidence, and timing limits

The result is a traditional astrological interpretation, not a scientific
forecast or professional medical, legal, or financial advice.
