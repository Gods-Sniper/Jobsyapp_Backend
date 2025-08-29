const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getCoordinates(location) {
  const apiKey = process.env.GEOCODE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    location
  )}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    return { latitude: lat, longitude: lng };
  } else {
    throw new Error("Location not found");
  }
}

module.exports = { getCoordinates };
