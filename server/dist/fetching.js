import axios from "axios";
import cheerio from "cheerio";
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
    }
    catch (error) {
        console.error("Error fetching webpage information:", error.message);
        return null;
    }
}
// const webpageUrl: string =
//     "https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f";
// fetchWebpageInfo(webpageUrl);
export { fetchWebpageInfo };
