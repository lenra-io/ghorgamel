import { env } from "process";
const githubToken = env.GITHUB_TOKEN;
const cacheDuration = env.CACHE_DURATION || 3600 * 1000;

const cache = {};

/**
 * 
 * @param {string} url The API URL
 * @returns {Promise<*>}
 */
export async function callApi(url) {
    const now = Date.now();
    if (!(url in cache) || now - cache[url].time > cacheDuration) {
        const options = githubToken ? { headers: { "Authorization": `Bearer ${githubToken}` } } : undefined;
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(`Fetch error [${resp.status}] ${resp.statusText}`);
        const result = await resp.json();
        cache[url] = {
            result,
            time: now
        };
    }
    return cache[url].result;
}

/**
 * @typedef Repository GitHub repository representation
 * @property {number} id The repo ID
 * @property {string} name The repo name
 * @property {string} stargazers_url The repo stargazers URL
 * @property {string} contributors_url The contributors list URL
 */

/**
 * Gets the organization repositories
 * @param {string} organization The organization name
 * @returns {Promise<Repository[]>}
 */
export async function getOrganizationRepos(organization) {
    return callApi(`https://api.github.com/orgs/${organization}/repos?per_page=100`);
}