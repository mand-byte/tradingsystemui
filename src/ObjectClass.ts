export interface Exchange{
    id:number,
    ex:string,
    account:string,
}
export interface OrderInfo{
    id:number,
    symbol?:string,
    ex:number,
    posSide?:string,
    size?:number,
    size_exec?:number,
    priceAvg?:number,
    isswap?:boolean,
    tp?:number,
    sl?:number,
    leverage?:number,
    marginMode?:string,
    openTime?:string,
    status?:number
}
export interface AccountInfo{
    total:number,
    available:number,
    unrealizedPL:number,
    symbol:string
}

export interface StatisticsInfo{
    datetime:string,
    money:number,
    exId:number
}
export interface SwapPosition{
    symbol:string,
    posSide:string,
    size:number,
    margin:number,
    leverage:number,
    upl:number
    priceAvg:number,
    marginMode:string,
}
export interface SpotPosition{
    total:number,
    available:number,
    unrealizedPL:number,
    symbol:string
}
export interface OrderRequest{
    exid: number
    symbol: string
    money: number
    isswap: boolean  //true 为swap false为spot
    posSide: boolean // true 为long false为short
    orderType: boolean  // true为limit false为market
    price: number
    sl: number
    tp: number
    sltp_type:number
}
export interface ModifySLTPRequest{
    exid?: number
    id?:number
    symbol?:string
    posSide?:boolean  
    isswap?:boolean
    sl: number
    tp: number
}
export interface AddExRequest{
    ex:string
    account:string
    apikey:string
    api_secret:string
    api_password:string
}
export interface SetMartinRequest{
    use_ratio:boolean
    ratio:number
    fixed:number[]
    max_count:number
    except_num:number 
}