# Invisible Atlas

**An open-data field note about Safecast's public environmental measurement API.**

Invisible Atlas is a small, responsive, no-build web app for exploring real Safecast measurement records around a chosen coordinate. It is designed as a submission companion for the challenge **“Find the most useful free API nobody knows about.”**

> Safecast is an established project, so this entry does not claim the organization itself is unknown. The discovery angle is the usefulness of its anonymous, openly reusable API for building independent environmental data tools.

## What it does

- Queries Safecast's public measurements endpoint without an API key.
- Lets users choose latitude, longitude, and search radius.
- Maps returned records with coordinates.
- Displays raw measurement values, units, capture times, and coordinates where available.
- Opens the exact query as raw JSON.
- Exports returned rows as CSV.
- Includes reproducible curl instructions and a submission draft.

## API discovery

- **Name:** Safecast Measurements API
- **Endpoint:** `https://api.safecast.org/measurements.json`
- **Official data access policy:** https://safecast.org/frequently-asked-questions/openness-and-data-access/
- **Official data page / CC0:** https://safecast.org/data/
- **API home:** https://api.safecast.org/

Safecast says that querying and downloading data can be done anonymously without signing up. Its data page states that measurements are published under CC0. Check the linked official pages before submission in case the API or its terms change.

## Run locally

No build step or package installation is required.

```bash
git clone https://github.com/YOUR-USERNAME/invisible-atlas.git
cd invisible-atlas
python3 -m http.server 8000
```

Open http://localhost:8000

The map uses Leaflet and OpenStreetMap tiles loaded from their public CDN. A browser may block a direct API call if the API's cross-origin policy changes. If that happens, the raw JSON link and curl example remain available for verification.

## Reproduce the request

```bash
curl -L -H "Accept: application/json" \
  "https://api.safecast.org/measurements.json?latitude=35.68&longitude=139.76&distance=500&per_page=100"
```

The query asks for records within 500 meters of the supplied coordinates. The response is live data and can change. Do not paste a fabricated or stale response into a challenge submission. Save your own response at submission time:

```bash
curl -fLsS -H "Accept: application/json" \
  "https://api.safecast.org/measurements.json?latitude=35.68&longitude=139.76&distance=500&per_page=100" \
  -o safecast-response.json
```

A lightweight check is included:

```bash
./scripts/check-api.sh
```

## Practical use case

**Open Environmental Data Explorer:** let researchers, journalists, educators, and curious residents inspect the locations and dates of citizen-science radiation measurements. It could be extended with time filters, data-coverage views, CSV analysis, and comparisons with other open datasets.

This app is a data exploration tool, not a health-risk assessment. Measurements can vary by device, calibration, sampling method, and time. A missing measurement is not evidence of a lack of radiation, and one reading should not be used to conclude that a place is safe or unsafe.

## Why it's special

Many APIs in popular directories focus on weather, finance, maps, or entertainment. Safecast offers a less commonly discussed dataset: geographically located environmental observations from a distributed citizen-science effort. The raw data can be queried and independently re-visualized instead of being locked into a single map interface.

Safecast itself is not obscure to its community; the case for this challenge is that the API and its practical uses may be unfamiliar to many developers.

## Sources

- Safecast openness and data access: https://safecast.org/frequently-asked-questions/openness-and-data-access/
- Safecast data policy: https://safecast.org/data/
- Official API: https://api.safecast.org/
- Safecast API source repository: https://github.com/Safecast/safecastapi

## License

- **This demo's code:** MIT, see `LICENSE`.
- **Safecast data:** Safecast says its data is published under CC0. This repository does not bundle a dataset.
- **Map tiles:** © OpenStreetMap contributors; see https://www.openstreetmap.org/copyright.
- This is an independent project and is not affiliated with or endorsed by Safecast.
