const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getCoordinates(location) {
  const apiKey = process.env.GEOCODE_API_KEY;
  if (!apiKey) throw new Error("Missing GEOCODE_API_KEY environment variable");

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    location
  )}&key=${apiKey}`;
  // console.log("OpenCage request URL:", url);

  const response = await fetch(url);
  const data = await response.json();
  // console.log("OpenCage response:", data);

  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } else {
    throw new Error(`Location not found for: ${location}`);
  }
}

module.exports = { getCoordinates };
