
import qs from "qs"

const apiUrl = process.env.REACT_APP_API_URL
interface HttpConfig extends RequestInit {
    token?: string
    data?: object
}
export const  Http = async (endpoint: string, { data, token, headers, ...customConfig }: HttpConfig) => {
    const config = {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': data ? 'application/json' : '',
            'Accept':'*/*'

        },
        ...customConfig
    }
    if (config.method.toUpperCase() === "GET") {
        endpoint += `?${qs.stringify(data)}`
    } else {
        config.body = JSON.stringify(data || {})
    }
    var url=`${apiUrl}${endpoint}`
    return window.fetch(url, config)

}