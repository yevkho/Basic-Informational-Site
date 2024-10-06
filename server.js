const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// 1) create server
const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(url.parse(req.url, true).pathname); //same thing

  // Get the file extension of the request (e.g., .html, .css)
  const ext = path.extname(req.url);
  console.log(ext);

  // Set the correct content type based on the file extension
  let contentType = "text/html";
  if (ext === ".css") {
    contentType = "text/css";
  }

  // Construct the file path based on request
  let filePath;
  if (ext === ".css") {
    // requests for css files
    filePath = path.join(__dirname, "pages", req.url);
  } else {
    // requests for html files
    filePath = path.join(
      __dirname,
      "pages",
      req.url === "/" ? "index.html" : req.url + ".html"
    );
  }

  // Set Header with the correct content type for the response
  res.setHeader("Content-Type", contentType);

  // read requested html file and respond
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      // Serve the 404 page if the requested file doesn't exist
      fs.readFile("./pages/404.html", "utf8", (err404, notFoundContent) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", contentType);
        res.end(notFoundContent);
      });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.write(content);
      res.end();
    }
  });
});

// 2) wire it (server) up to host & port number
server.listen(8080, "localhost", () => {
  console.log(
    "server is set up on local host & listening for requests on port 8080"
  );
});
