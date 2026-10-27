# Challenge submission draft

## Safecast Measurements API: an open map of environmental observations

**API name:** Safecast Measurements API  
**Endpoint:** https://api.safecast.org/measurements.json  
**Official access policy:** https://safecast.org/frequently-asked-questions/openness-and-data-access/  
**Data policy:** https://safecast.org/data/

### What it does

Safecast is a volunteer-driven nonprofit that collects environmental measurements, including radiation readings, and publishes its data openly. Its measurements endpoint lets developers query records programmatically, including by geographic coordinates and radius. Safecast documents anonymous querying and downloading without signup, and states that its data is released under CC0.

### Reproducible request

Run this command to query records around Tokyo:

```bash
curl -fLsS -H "Accept: application/json" \
  "https://api.safecast.org/measurements.json?latitude=35.68&longitude=139.76&distance=500&per_page=100"
```

**Important:** paste the actual JSON response captured immediately before submitting here. Do not invent values or use an old response as proof that the API is live.

### Practical use case

I built **Invisible Atlas**, a lightweight interactive explorer that queries the API for a selected coordinate and radius, maps returned measurement locations, displays the record values and timestamps, and exports the results to CSV. A useful next step would be a time-aware view of coverage and historical observations, with clear caveats about sensor differences and sampling conditions.

### Why it is worth knowing about

The interesting part is not simply that a map exists. The public API allows developers to build independent interfaces and analyses over a distributed citizen-science dataset. That makes it useful for educational projects, open-data journalism, environmental data exploration, and research prototypes without requiring a commercial API account.

Safecast is an established project rather than an unknown organization, so the claim here is that its API is an underused resource for developers who may not know they can query the underlying data directly.

### Demo

- Source repository: `https://github.com/YOUR-USERNAME/invisible-atlas`
- Live demo: add your GitHub Pages URL after deployment.
- Screenshot: attach a screenshot after testing the live app and loading real results.

### Limitations and responsible interpretation

Measurements are observations, not a standalone safety assessment. Readings can vary with device type, calibration, time, and sampling method. A missing reading is not proof of zero radiation. This demo should not be used to make medical or emergency decisions.

### Verification checklist before submission

- [ ] Run the curl command and save the live JSON response.
- [ ] Confirm HTTP status and response format.
- [ ] Open the demo and check that the map and data table populate.
- [ ] If browser CORS blocks requests, document that limitation rather than claiming the in-browser query works.
- [ ] Replace the placeholder GitHub URL and add the deployed demo URL.
- [ ] Verify the official API access policy and data license again on submission day.
