import { AddExRequest, ModifySLTPRequest, OrderRequest, SetMartinRequest } from "ObjectClass"
import { Http } from "httpwarp"


const localStorageKey = '__auth_provider_token__'

export interface User {
    id: number
    token: string
    username: string
}

export const getToken = () => window.localStorage.getItem(localStorageKey)

export const handleUserResponse = (user: User) => {
    window.localStorage.setItem(localStorageKey, user.token || '')
    return user
}

export const login = async ({ data }: { data: { username: string, password: string } }) => {
    return Http('/login', {
        method: 'POST',
        data: {
            'username': data.username,
            'password': data.password
        },
    }).then(async (response: Response) => {
        if (response.ok) {
            var j = await response.json()
            return handleUserResponse(j['data'])
        }
    });
}
export const getAllExchanges = async () => {
    return Http('/all-exchanges', {
        method: 'GET',
        token: getToken() || ''
    })
}
export const getAllOrders = async () => {
    return Http('/all-orders', {
        method: 'GET',
        token: getToken() || '',

    })
}
export const getStatistics = async (exid:number,day: number) => {
    return Http('/all-statistics', {
        method: 'GET',
        token: getToken() || '',
        data: {
            'exid':exid,
            'day': day
        }

    })
}
export const getAllAccounts = async () => {
    return Http('/all-accounts', {
        method: 'GET',
        token: getToken() || '',

    })
}
export const getAllPositions = async () => {
    return Http('/all-positions', {
        method: 'GET',
        token: getToken() || '',

    })
}
export const makeOrder = async (request: OrderRequest) => {
    return Http('/make-order', {
        method: 'POST',
        token: getToken() || '',
        data: request

    })
}

export const cancelOrder = async (id: number) => {
    return Http('/cancel-order', {
        method: 'POST',
        token: getToken() || '',
        data: {
            'orderID': id
        }

    })
}
export const closeOrder = async (id: number) => {
    return Http('/close-order', {
        method: 'POST',
        token: getToken() || '',
        data: {
            'orderID': id
        }

    })
}


export const modifySLTP = async (data:ModifySLTPRequest) => {
    return Http('/modify-sltp', {
        method: 'POST',
        token: getToken() || '',
        data: data

    })
}
export const closePosition = async (exId: number, symbol: string,  posSide?: string) => {
    if (posSide) {
        return Http('/close-pos', {
            method: 'POST',
            token: getToken() || '',
            data: {
                'exId': exId,
                'symbol': symbol,
                'isswap': true,
                'posSide': posSide
            }

        })
    } else {
        return Http('/close-pos', {
            method: 'POST',
            token: getToken() || '',
            data: {
                'exId': exId,
                'symbol': symbol,
                'isswap': false
            }

        })
    }

}

export const GetExList=async ()=>{
    return Http('/get-ex-list', {
        method: 'GET',
        token: getToken() || ''
    })
}

export const GetSetting= async ()=>{
    return Http('/get-setting', {
        method: 'GET',
        token: getToken() || ''
    })
}

export const SetExchangeStatus= async (id:number,status:number)=>{
    return Http('/set-ex-status', {
        method: 'POST',
        token: getToken() || '',
        data: {'id':id,"status":status}
    })
}
export const SetExchangeTVSingal= async (id:number,no_open:number,no_close:number)=>{
    return Http('/set-ex-tvsingal', {
        method: 'POST',
        token: getToken() || '',
        data: {'id':id,"no_open":no_open,"no_close":no_close}
    })
}
export const AddExchange= async (data:AddExRequest)=>{
    return Http('/add-ex', {
        method: 'POST',
        token: getToken() || '',
        data: data
    })
}

export const SetTG= async (report_err:boolean,report_open:boolean,report_close:boolean)=>{
    return Http('/set-tg', {
        method: 'POST',
        token: getToken() || '',
        data: {
            'TG_report_err': report_err,
            'TG_report_open': report_open,
            'TG_report_close': report_close
        }
    })
}
export const SetLeverage= async (leverage:number)=>{
    return Http('/set-leverage', {
        method: 'POST',
        token: getToken() || '',
        data: {
            'leverage': leverage
        }
    })
}
export const SetMartin= async (data:SetMartinRequest)=>{
    return Http('/set-martin', {
        method: 'POST',
        token: getToken() || '',
        data: data
    })
}
export const SetTrend= async (use_ratio:boolean,num:number,tp:number,sl:number)=>{
    return Http('/set-trend', {
        method: 'POST',
        token: getToken() || '',
        data: {
            'use_ratio':use_ratio,
            'num':num,
            'tp':tp,
            'sl':sl
        }
    })
}
export const logout = async () => window.localStorage.removeItem(localStorageKey)