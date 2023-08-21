import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    const { title, favicon } = await fetchWebpageInfo(url);
    res.status(200).json({ title: title });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
}

async function fetchWebpageInfo(url) {
  try {
    // Fetch the webpage's HTML content
    const response = await axios.get(url);
    const html = response.data;
    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);
    // Extract the title
    const title = $("title").text().trim();
    // Extract the favicon
    let favicon = $('link[rel="icon"]').attr("href");
    if (!favicon) {
      // If the 'rel="icon"' link tag is not found, try 'rel="shortcut icon"'
      favicon = $('link[rel="shortcut icon"]').attr("href");
    }
    // If favicon is relative, make it an absolute URL
    if (favicon && !favicon.startsWith("http")) {
      const baseUrl = new URL(url).origin;
      favicon = new URL(favicon, baseUrl).href;
    }
    console.log("Webpage Title:", title);
    console.log("Favicon URL:", favicon);
    return { title, favicon };
  } catch (error) {
    console.error("Error fetching webpage information:", error.message);
    return null;
  }
}
