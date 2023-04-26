<div id="top"></div>
<!--
*** This README was created with https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Ghorgamel</h3>

  <p align="center">
    The GitHub Organization Melter is a JavaScript tool coupled to a REST API to get aggregated informations of your GitHub organization to your website.
    <br />
    <br />
    <a href="https://github.com/lenra-io/ghorgamel/issues">Report Bug</a>
    ·
    <a href="https://github.com/lenra-io/ghorgamel/issues">Request Feature</a>
  </p>
</div>

- [Getting started](#getting-started)
- [Configure](#configure)
- [REST API](#rest-api)
- [Include to your website](#include-to-your-website)
  - [Stargazers](#stargazers)
  - [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Getting started

 Start a Ghorgamel server with Docker: 

```bash
docker run -it --rm -p 8080:8080 --env GITHUB_ORGANIZATION="lenra-io" lenra/ghorgamel
```
 
Or from the source code:

```bash
npm i
GITHUB_ORGANIZATION="lenra-io" npm start
```

The `GITHUB_ORGANIZATION` environment variable let you define the GitHub Organization to work with (in this example, [`lenra-io`](https://github.com/lenra-io)).

If your organization has many repos, you should use a [GitHub API Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `GITHUB_TOKEN` environment variable.

<p align="right">(<a href="#top">back to top</a>)</p>

## Configure

Ghorgamel can be configured with the next environment variables:

- `GITHUB_ORGANIZATION`: the GitHub organization (default: `lenra-io`)
- `GITHUB_IGNORED_CONTRIBUTORS`: the GitHub users' login separated by a coma you want ignor in the contribution aggregation. Useful to ignore bots
- `GITHUB_TOKEN`: the GitHub API Token
- `CACHE_DURATION`: the cache duration between two API calls to the same URI in milliseconds (default: `3600000` => 1 hour)
- `CORS_ORIGIN`: the CORS origin header list (default: `*` not recommanded for production)
- `PORT`: the server exposed port (default: `8080`)

<p align="right">(<a href="#top">back to top</a>)</p>

## REST API

Once up, Ghorgamel exposes some REST API to let you request what you want:

- `/stargazers`: returns the number of unique stargazers on all the repos.
- `/contributors`: returns a random list of contributors from all the organization repos. The resulting list is limited to 12 contributors by default but it can be overrided with the `size` query parameter.

<p align="right">(<a href="#top">back to top</a>)</p>

## Include to your website

You can easely integrate [REST API](#rest-api) results to your website by using our JavaScript API combine to the basic style.

Just include the basic style to your website:

```html
<link rel="stylesheet" as="style" type="text/css" href="https://<ghorgamel-url>/ghorgamel.css"/>
```

End the script as placeholder of the content, with the `data-type` attribute with the wanted content:

```html
<script src="https://<ghorgamel-url>/ghorgamel.js" data-type="contributors" data-size="6" defer></script>
```

See a complete example in the [`index.html` file](src/static/index.html).

### Stargazers

Display your stargazers number:

```html
    <p>Our organization is having <script src="ghorgamel.js" data-type="stargazers" defer></script> stars.</p>
```

### Contributors

Display some random contributors. You specify the contributors list size with the `data-size` attribute:

```html
    <script src="ghorgamel.js" data-type="contributors" data-size="6" defer></script>
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please open an issue with the tag "enhancement".
Don't forget to give the project a star if you liked it! Thanks again!

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the **MIT** License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Lenra - [@lenra_dev](https://twitter.com/lenra_dev) - contact@lenra.io

Project Link: [https://github.com/lenra-io/lesta](https://github.com/lenra-io/lesta)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/lenra-io/ghorgamel.svg?style=for-the-badge
[contributors-url]: https://github.com/lenra-io/ghorgamel/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lenra-io/ghorgamel.svg?style=for-the-badge
[forks-url]: https://github.com/lenra-io/ghorgamel/network/members
[stars-shield]: https://img.shields.io/github/stars/lenra-io/ghorgamel.svg?style=for-the-badge
[stars-url]: https://github.com/lenra-io/ghorgamel/stargazers
[issues-shield]: https://img.shields.io/github/issues/lenra-io/ghorgamel.svg?style=for-the-badge
[issues-url]: https://github.com/lenra-io/ghorgamel/issues
[license-shield]: https://img.shields.io/github/license/lenra-io/ghorgamel.svg?style=for-the-badge
[license-url]: https://github.com/lenra-io/ghorgamel/blob/master/LICENSE
