# Nerve Planning Sheet
### Pitch
Nerve v0 is a webapp aiming to give bored people bite-sized challenges they can do right now within walking distances of them. It's quick to get set up, and drives foot traffic to local businesses.

### Target Audience and where we come in
- Some people struggle to find productive things to do throughout their day. That's why we implement a simple solution: A one-click stop for short challenges to pass time and (maybe) push you outside your comfort zone!

- Some businesses struggle to reach audiences, whether it be due to the lack of marketing and advertisements, or simply a misunderstanding of what they may have to offer. We aim to get people through the door and let the businesses take the reins from there.

### MVP User Story
>"As a visitor stuck at home on a Saturday afternoon, I open the site, allow location access, click a button, and instantly receive a fun challenge I can complete within ~2km."

Acceptance criteria:
- Site loads in <3 seconds on desktop and mobile
- If geolocation permission is granted, challenge radius logic is applied
- If permission is denied, a random challenge (although not specific) will still appear
- A "Give me another" button fetches a fresh challenge without refresh
- No login, no ads, no paywalls


### Nice-To-Haves (next sprint)
- Users can mark challenges as "done" and share on socials
- LLM-generated dynamic challenges

### Out-of-scope (long term possible)
- Map with completed challenge pins (for progress)
- Difficulty levels & Filters
- Leaderboards
- Comprehensive moderation system (the prompts will be hand-curated for now)

### Data model
This will be available in the `datamodel.json` file
