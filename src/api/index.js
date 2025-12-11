import API_KEY from '../.env'

const baseURL = "https://morpion-api.edu.netlor.fr"
const headers = {
    'Content-type': 'application/json',
    'Authorization': 'key=[${API_KEY}]'
}
export {baseURL,headers}