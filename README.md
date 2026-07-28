# Vedic Jyotish Agent Skill

`read-vedic-jyotish` calculates a Lahiri sidereal Vedic chart locally and
guides an agent through a detailed, evidence-grounded traditional reading.
Birth details are not sent to a project-owned server.

## Ask GitHub Copilot to install it

Paste this into GitHub Copilot Agent mode or Copilot CLI:

> Preview and install the `read-vedic-jyotish` skill from
> `https://github.com/lavish0000/vedic-jyotish-skill` at user scope. After
> installation, use it to give me a detailed Vedic Jyotish reading.

If manual installation is preferred, GitHub CLI 2.90 or later supports:

```bash
gh skill preview lavish0000/vedic-jyotish-skill read-vedic-jyotish
gh skill install lavish0000/vedic-jyotish-skill read-vedic-jyotish --scope user
```

The first calculation may require approval to run the bundled local script.
No external model key or hosted calculation service is required.

## Method

- Lahiri sidereal ayanamsha
- whole-sign houses
- mean Rahu and opposite Ketu
- Swiss Ephemeris 2.10.03 with built-in Moshier data
- Vimshottari dasha with a 365.25-day year
- explicit supporting factors, counter-signals, confidence, and timing limits

The result is a traditional astrological interpretation, not a scientific
forecast or professional medical, legal, or financial advice.
