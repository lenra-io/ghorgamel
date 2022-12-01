import express from 'express';
import { env } from 'process';
import * as url from 'url';
import { callApi, getOrganizationRepos } from './github-api.js';

const staticPath = url.fileURLToPath(new URL('static', import.meta.url));;
const app = express();
const port = env.PORT || 8080;
const githubOrganization = env.GITHUB_ORGANIZATION || 'lenra-io';
const notContributors = env.GITHUB_IGNORED_CONTRIBUTORS?.split(',').map(id => parseInt(id.trim())) || [
    6428498,// Louis
    32174276,// Semantic Release Bot
    38187238,// Flavien
    8969556,// Thomas
    45465504,// Emric
    36544012,// Jonas
    91874264,// Clement
    41898282,// GitHub Action Bot
    87380809,// Jonas 2
    102291723,// Alienor
    49699333,// Dependabot
];

const contributorsSize = 12;

app.get('/contributors', async (req, res) => {
    try {
        const repos = await getOrganizationRepos(githubOrganization);
        const promises = repos.map(async repo => {
            const collaborators_url = repo.contributors_url.replace(/[{][^}]+[}]/g, "");
            return callApi(`${collaborators_url}?per_page=100`);
        });
        const foundIds = [];
        const results = await Promise.all(promises);
        let users = results
            .flat()
            .map(({ id, login, html_url, avatar_url }) => ({ id, login, url: html_url, avatar_url }))
            .filter(user => {
                if (foundIds.includes(user.id) || notContributors.includes(user.id)) return false;
                foundIds.push(user.id);
                return true;
            });
        const result = [];
        const size = Math.min(req.query.size || contributorsSize, users.length);
        while (result.length < size) {
            const pos = Math.round(Math.random() * (users.length - 1));
            result.push(users[pos]);
            users.splice(pos, 1);
        }
        res.send(result);
    }
    catch (error) {
        console.log('An error occured', error);
        res.status(500).send();
    }
});

app.get('/stargazers', async (_req, res) => {
    try {
        const repos = await getOrganizationRepos(githubOrganization);
        const promises = repos.map(async repo => {
            return callApi(repo.stargazers_url);
        });
        const logins = (await Promise.all(promises))
            .flat()
            .map(user => user.login)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        res.send({ stars: logins.length });
    }
    catch (error) {
        console.log('An error occured', error);
        res.status(500).send();
    }
});

app.use(express.static(staticPath));

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at http://localhost:${port}`);
});