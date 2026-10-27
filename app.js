(() => {
  "use strict";
  const API = "https://api.safecast.org/measurements.json";
  const $ = (id) => document.getElementById(id);
  const map = L.map("map", { scrollWheelZoom: false }).setView([35.68, 139.76], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const markers = L.layerGroup().addTo(map);
  let circle = null;
  let latestRows = [];

  const escapeHtml = (value) => String(value ?? "—").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));

  function coords(record) {
    const location = record.location || {};
    const lat = Number(record.latitude ?? location.latitude ?? record.lat);
    const lon = Number(record.longitude ?? location.longitude ?? record.lon ?? record.lng);
    return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
      ? [lat, lon] : null;
  }
  function valueOf(record) { return record.value ?? record.value_text ?? record.measurement ?? "—"; }
  function unitOf(record) { return record.unit ?? record.unit_name ?? "—"; }
  function capturedOf(record) { return record.captured_at ?? record.created_at ?? record.timestamp ?? "—"; }

  function setStatus(text, kind = "") {
    $("status").textContent = text.toUpperCase();
    $("status").className = "status " + kind;
  }
  function makeUrl() {
    const lat = Number($("lat").value), lon = Number($("lon").value), distance = Number($("distance").value);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      throw new Error("Enter a valid latitude (−90 to 90) and longitude (−180 to 180).");
    }
    const url = new URL(API);
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("distance", String(distance));
    url.searchParams.set("per_page", "100");
    return url;
  }
  function renderRows(rows) {
    const body = $("records");
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="5" class="empty">No measurement records were returned for this query.</td></tr>';
      return;
    }
    body.innerHTML = rows.slice(0, 100).map((r) => {
      const c = coords(r) || [];
      return `<tr><td>${escapeHtml(valueOf(r))}</td><td>${escapeHtml(unitOf(r))}</td><td>${escapeHtml(capturedOf(r))}</td><td>${escapeHtml(c[0] ?? "—")}</td><td>${escapeHtml(c[1] ?? "—")}</td></tr>`;
    }).join("");
  }
  function csvEscape(v) { return '"' + String(v ?? "").replace(/"/g, '""') + '"'; }
  function downloadCsv() {
    const header = ["value","unit","captured_at","latitude","longitude"];
    const lines = [header.join(",")];
    latestRows.forEach((r) => {
      const c = coords(r) || [];
      lines.push([valueOf(r),unitOf(r),capturedOf(r),c[0] ?? "",c[1] ?? ""].map(csvEscape).join(","));
    });
    const blob = new Blob([lines.join("\r\n")], {type:"text/csv;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "safecast-measurements.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  async function search() {
    let url;
    try { url = makeUrl(); } catch (e) { setStatus("Invalid input", "error"); $("message").textContent = e.message; return; }
    $("rawLink").href = url.toString();
    $("curlCode").textContent = `curl -L "${url.toString()}"`;
    setStatus("Loading", "loading");
    $("message").textContent = "Requesting public Safecast measurements…";
    $("searchBtn").disabled = true;
    try {
      const response = await fetch(url.toString(), {headers: {"Accept":"application/json"}});
      if (!response.ok) throw new Error(`Safecast returned HTTP ${response.status}. Try again or open the raw JSON URL.`);
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : (payload.measurements || payload.data || payload.results || []);
      if (!Array.isArray(rows)) throw new Error("The API response format was different than expected. Open the raw JSON link to inspect it.");
      latestRows = rows;
      markers.clearLayers();
      if (circle) map.removeLayer(circle);
      const center = [Number($("lat").value), Number($("lon").value)];
      const distance = Number($("distance").value);
      circle = L.circle(center, {radius:distance, color:"#506d2d", weight:1, fillColor:"#c9f05b", fillOpacity:.16}).addTo(map);
      const bounds = [center];
      let mapped = 0;
      rows.forEach((r) => {
        const c = coords(r);
        if (!c) return;
        const marker = L.circleMarker(c, {radius:5, color:"#f4f1e9", weight:1.5, fillColor:"#56752c", fillOpacity:.95}).bindPopup(
          `<strong>Measurement</strong><br>Value: ${escapeHtml(valueOf(r))} ${escapeHtml(unitOf(r))}<br>Captured: ${escapeHtml(capturedOf(r))}<br>Location: ${c[0].toFixed(5)}, ${c[1].toFixed(5)}`
        );
        marker.addTo(markers); bounds.push(c); mapped++;
      });
      map.fitBounds(L.latLngBounds(bounds).pad(.15), {maxZoom:15});
      $("count").textContent = rows.length.toLocaleString();
      $("message").textContent = rows.length
        ? `${mapped} record${mapped===1?"":"s"} with usable coordinates mapped. Inspect any dot for the record details.`
        : "The API returned no records for this location and radius.";
      renderRows(rows);
      $("downloadBtn").disabled = rows.length === 0;
      setStatus("Live response");
    } catch (e) {
      setStatus("Request failed", "error");
      $("message").textContent = `${e.message} If the browser blocks cross-origin requests, use the raw JSON link or the curl command in the README.`;
      $("count").textContent = "—";
      $("records").innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(e.message)}</td></tr>`;
      $("downloadBtn").disabled = true;
    } finally { $("searchBtn").disabled = false; }
  }
  $("searchBtn").addEventListener("click", search);
  $("downloadBtn").addEventListener("click", downloadCsv);
  document.querySelectorAll("[data-lat]").forEach((button) => button.addEventListener("click", () => {
    $("lat").value = button.dataset.lat;
    $("lon").value = button.dataset.lon;
    search();
  }));
  $("copyCurl").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(`curl -L "${makeUrl().toString()}"`);
      $("copyCurl").textContent = "Copied ✓";
      setTimeout(() => $("copyCurl").textContent = "Copy request ⧉", 1500);
    } catch {
      $("copyCurl").textContent = "Select the request above";
    }
  });
  search();
})();
