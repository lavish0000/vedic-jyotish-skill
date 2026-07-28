# Vedic Jyotish Agent Skill

`read-vedic-jyotish` calculates a Lahiri sidereal Vedic chart locally and
guides an agent through a detailed, evidence-grounded traditional reading.
Birth details are not sent to a project-owned server.

## Ask GitHub Copilot to install it

Paste this into GitHub Copilot Agent mode or Copilot CLI:

> Use GitHub CLI 2.90 or later. Run
> `gh auth status --hostname github.com` first. If it is not authenticated, run
> `gh auth login --hostname github.com` and wait for me to finish signing in.
> Then run
> `gh skill preview lavish0000/vedic-jyotish-skill read-vedic-jyotish`.
> Show me the preview and stop until I explicitly approve it. After I approve,
> run
> `gh skill install lavish0000/vedic-jyotish-skill read-vedic-jyotish --agent github-copilot --scope user`.
> If GitHub reports an API rate limit, tell me and stop instead of retrying.
> In an existing Copilot CLI session, ask me to enter `/skills reload`.
> If this surface cannot reload skills, ask me to start a new session. Once the
> skill is available, continue this same request without asking me to paste it
> again: use `/read-vedic-jyotish` to give me a detailed Vedic Jyotish reading
> and ask me only for missing birth details.

For a Hinglish reading, add: `Reply in natural Hinglish written in English
letters.`

For manual GitHub Copilot installation, authenticate GitHub CLI 2.90 or later
before previewing the skill:

```bash
gh auth status --hostname github.com
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
