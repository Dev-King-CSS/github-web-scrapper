require("dotenv").config()
//! Server Port
const PORT = 8080
//! Imports
const axios = require("axios")
const { load } = require("cheerio")
const app = require("express")()

//* A small handy trick for debugging
const { log } = console

//!! The WHOLE data is stored in this variable
const repos = []

//! Scrapping the data from the URL
axios(process.env.URL)
  .then(({ data }) => {
    const $ = load(data)

    //* Mapping through the repositories data and storing it to an array
    const getData = $("li[itemprop='owns']", data).each(function () {
      const projectName = $(this)
        .find("[itemprop='name codeRepository']")
        .text()
        .trim()
      const url = `https://github.com${$(this)
        .find("[itemprop='name codeRepository']")
        .attr("href")}`
      const description = $(this)
        .find('[itemprop="description"]')
        .text()
        .trim()
      const language = $(this)
        .find("[itemprop='programmingLanguage']")
        .text()
        .trim()

      //* Compiling the individual data into an object
      const singleRepoDetails = {
        projectName,
        url,
        description,
        language,
      }

      //* Pushing the object into the array
      return repos.push(singleRepoDetails)
    })

    //* Returning the cheerio element
    return getData
  })
  .catch(({ message }) => log(message) /* Logging the error */)

//! Displaying the data on the site using express
app.get("/", (req, res) => res.send(repos))

//! Starting the server on a port
app.listen(PORT, () =>
  log(`Connected to http://localhost:${PORT} sucessfully!!`)
)

/* THE END */
