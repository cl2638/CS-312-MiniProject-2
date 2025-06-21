const express = require("express");
const path = require("path");
const getUVData = require("../utils/weatherData"); // Adjust path if needed

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine and specify views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files like CSS from public folder
app.use(express.static(path.join(__dirname, "../public")));

// Home page route
app.get("/", (req, res) => {
  res.render("index", { data: null, error: null });
});

// Weather route - handles UV data fetch and rendering results
app.get("/weather", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.render("index", {
      data: null,
      error: "Please enter latitude and longitude."
    });
  }

  try {
    const data = await getUVData(lat, lng);

    const uv = data.result.uv_max;           // Use daily max UV index
    const uvTimeUTC = data.result.uv_max_time;

    // Convert UV max time to local time string
    const uvDate = new Date(uvTimeUTC);
    const uvLocalTime = uvDate.toLocaleString('en-US', { timeZoneName: 'short' });

    let message;
    if (uv >= 6) message = "Yes! Wear sunscreen. UV is high.";
    else if (uv >= 3) message = "Yes, it's a good idea. UV is moderate.";
    else message = "Probably not needed. UV is low.";

    res.render("index", {
      data: {
        lat,
        lng,
        uv,
        uvLocalTime,
        message
      },
      error: null
    });
  } catch (err) {
    res.render("index", {
      data: null,
      error: "Error fetching UV data. Please check your inputs."
    });
  }
});

// About page route
app.get("/about", (req, res) => {
  res.render("about");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
