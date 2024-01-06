// export const dynamic = 'force-dynamic' // defaults to auto
/*
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await req.json()
  
  return Response.json({ data })
}
*/

import axios from "axios";
import cheerio from "cheerio";

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;
    console.log('url:', url);
    const { title, favicon } = await fetchWebpageInfo(url);
    if (title == null) return res.json({ error: `Unable to fetch data from url ${url}` });
    return Response.json({ title: title });
  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: 'An error occurred while fetching data from url' });
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
