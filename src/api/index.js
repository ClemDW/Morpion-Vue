import config from './config.js'

export const baseURL = "https://morpion-api.edu.netlor.fr"
export const headers = {
    'Content-type': 'application/json',
    'Authorization': `key=${config.API_KEY}`
}

export { baseURL, headers }