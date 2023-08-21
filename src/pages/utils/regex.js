function isValidURL(url) {
  const urlRegex = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-zA-Z]{2,}(\S*)?$/;
  return urlRegex.test(url);
}

export { isValidURL };

console.log(
  isValidURL("https://www.youtube.com/results?search_query=regex+to+check+url")
); // true
console.log(isValidURL("https://web.whatsapp")); // true
console.log(isValidURL("example.com")); // true
console.log(isValidURL("invalid-url")); // false

/*
This regular expression checks for the following URL patterns:

    Optional "http://" or "https://".
    Optional "www." subdomain.
    Domain name with at least two characters (e.g., .com, .org).
    Additional characters after the domain (e.g., paths, query strings).

Keep in mind that while this regular expression is a good starting point, URLs can have complex structures and special cases. Depending on your use case, you might need to adjust the regular expression or consider using built-in browser functions like URL for more accurate URL validation.
*/
