import express from 'express';
import cors from 'cors';
import { env } from 'process';
import * as url from 'url';
import { callApi, getOrganizationRepos } from './github-api.js';

const staticPath = url.fileURLToPath(new URL('static', import.meta.url));;
const app = express();
const port = env.PORT || 8080;
const githubOrganization = env.GITHUB_ORGANIZATION || 'lenra-io';
const corsOrigin = env.CORS_ORIGIN || "*";
const notContributors = env.GITHUB_IGNORED_CONTRIBUTORS?.split(',').map(login => login.trim()) || [];

const contributorsSize = 12;

app.use(cors({
    origin: corsOrigin,
    // some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200
}));

app.get('/contributors', async (req, res) => {
    try {
        const repos = await getOrganizationRepos(githubOrganization);
        const promises = repos.map(async repo => {
            const collaborators_url = repo.contributors_url.replace(/\{[^}]+\}/g, "");
            return callApi(`${collaborators_url}?per_page=100`);
        });
        const foundIds = [];
        const results = await Promise.all(promises);
        let users = results
            .flat()
            .map(({ id, login, html_url, avatar_url }) => ({ id, login, url: html_url, avatar_url }))
            .filter(user => {
                if (foundIds.includes(user.id) || notContributors.includes(user.login)) return false;
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