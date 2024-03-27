import { AccountInfo, Exchange } from "ObjectClass"
import { getAllAccounts, logout, makeOrder } from "api"
import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import React from 'react';
import { Button, Notification } from "@arco-design/web-react";

interface TradeContentProp {
    exchanges: Exchange[]
}

const TradeContent: FC<TradeContentProp> = ({ exchanges }) => {
    const [symbol, setSymbol] = useState('')
    const [money, setMoney] = useState(0)
    const [isswap, setIsswap] = useState(true)
    const [posSide, setPosSide] = useState('long')
    const [orderType, setOrderType] = useState(1)
    const [price, setPrice] = useState(0)
    const [sl, setSL] = useState(0)
    const [tp, setTP] = useState(0)
    const [sltpType, setSLTPType] = useState(1)
    const navigate = useNavigate();
    const [swapaccounts, setSwapAccounts] = useState<{ [key: number]: AccountInfo }>({});
    const [spotaccounts, setSpotAccounts] = useState<{ [key: number]: AccountInfo }>({});
    const [selectExIds, setSelectExIds] = useState<number[]>([])
    const [inputsl, setInputSL] = useState('')
    const [inputtp, setInputTP] = useState('')
    const [inputmoney, setInputMoney] = useState('')
    const [inputprice, setInputPrice] = useState('')
    useEffect(() => {
        const getAllAccountInfo = async () => {
            var response = await getAllAccounts()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    setSwapAccounts(result['data']['swap']);
                    setSpotAccounts(result['data']['spot']);

                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    Notification.warning({
                        title: 'Warning',
                        content: JSON.stringify(err),
                    })
                }
            }
        }
        getAllAccountInfo()
    }, [navigate])

    const handleCheckboxChange = (exId: number) => {
        if (selectExIds.includes(exId)) {
            // 如果已经存在于数组中，从数组中移除
            const updatedIds = selectExIds.filter((id) => id !== exId);
            setSelectExIds(updatedIds);
        } else {
            // 如果不存在于数组中，添加到数组
            const updatedIds = [...selectExIds, exId];
            setSelectExIds(updatedIds);
        }
    }


    const handleSubmit = async () => {
        if (selectExIds.length === 0) {
            Notification.warning({
                title: 'Warning',
                content: '请先选择交易账号',
            })
            return
        }
        if (sl === 0 && tp === 0) {
            Notification.warning({
                title: 'Warning',
                content: '止盈止损必须设置一个',
            })
            return
        }
        if (symbol === "") {
            Notification.warning({
                title: 'Warning',
                content: '标的不能为空',
            })
            return
        }
        if (money === 0) {
            Notification.warning({
                title: 'Warning',
                content: '投入金额必须大于0',
            })
            return
        }
        if (orderType === 1 && price === 0) {
            Notification.warning({
                title: 'Warning',
                content: '限价价格必须大于0',
            })
            return
        }
        for (var exid in selectExIds) {
            const id = selectExIds[exid]
            if (isswap==false) {
                if (spotaccounts[id].available < money) {
                    continue
                }
            }
            var response = await makeOrder({ exid: id, symbol: symbol, money: money, isswap: isswap, posSide: posSide === 'long' ? true : false, orderType: orderType === 1 ? true : false, sl: sl, tp: tp, price: price, sltp_type: sltpType })
            if (response) {
                if (response.ok) {
                    //var result = response.json()
                    var e = exchanges.find((ex) => { return ex.id === id })
                    if (e) {
                        Notification.success({
                            title: 'success',
                            content: `${e.ex} - ${e.account} - ${symbol} 下单成功`,
                        })
                    }

                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    console.log(err)
                    Notification.warning({
                        title: 'warning',
                        content: JSON.stringify(err),
                    })
                }
            }
        }

    }
    return (
        <div>
            <h3>开仓</h3>
            <h5>选择要开仓的交易所</h5>
            {
                exchanges.map((exchange, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(exchange.id)}
                        />
                        <label>{`${exchange.ex} - ${exchange.account}`}- 可用usdt:  {(isswap === false && exchange.ex !== 'okx'  && exchange.ex !== 'nexo') ? (spotaccounts[exchange.id]?.available.toFixed(2)) : (
                            swapaccounts[exchange.id]?.available.toFixed(2)
                        )}</label>
                    </div>
                ))
            }

            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>投入金额(usdt)</th>
                        <th>是否合约</th>
                        {isswap && <th>持仓方向</th>}
                        <th>订单类型</th>
                        {orderType === 1 && <th>限价价格</th>}
                        <th>止盈止损类型</th>
                        <th>止损</th>
                        <th>止盈</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" value={symbol} onChange={(e) => {
                            const regex = /^[a-z]+$/;
                            // 如果输入符合要求，更新输入值
                            if (regex.test(e.target.value) || e.target.value === "") {
                                setSymbol(e.target.value);
                            }
                        }} /></td>
                        <td><input type='text' value={inputmoney} onChange={(e) => {
                            setInputMoney(e.target.value.replace(/[^0-9.]/g, ''))

                        }} onBlur={() => {
                            const m = parseFloat(inputmoney)
                            if (!isNaN(m)) {
                                setMoney(m);
                                setInputMoney(m.toString())
                            }else{
                                setInputMoney('0')
                                setMoney(0);
                            }
                        }} /></td>
                        <td><input type='checkbox' checked={isswap} onChange={(e) => {
                            setIsswap(e.target.checked);
                        }} /></td>
                        {isswap &&
                            <td><select value={posSide} onChange={(e) => setPosSide(e.target.value)}>
                                <option value="long">long</option>
                                <option value="short">short</option>
                            </select></td>}
                        <td><select value={orderType} onChange={(e) => {
                            if (e.target.value === '0') {
                                setOrderType(0)
                            } else {
                                setOrderType(1)
                            }
                        }
                        }>
                            <option value="1">限价</option>
                            <option value="0">市价</option>
                        </select></td>
                        {
                            orderType === 1 && <td>
                                <input type='text' value={inputprice} onChange={(e) => {
                                    setInputPrice(e.target.value.replace(/[^0-9.]/g, ''))
                                }} onBlur={() => {
                                    const m = parseFloat(inputprice)
                                    if (!isNaN(m)) {
                                        setPrice(m);
                                        setInputPrice(m.toString())
                                    }else{
                                        setInputPrice('0')
                                        setPrice(0)
                                    }
                                }} />
                            </td>
                        }
                        <td><select
                            value={sltpType}
                            onChange={(e) =>
                                setSLTPType(parseInt(e.target.value))
                            }
                        >
                            <option value='0'>仓位止盈止损</option>,
                            <option value='1'>订单止盈止损</option>

                        </select></td>
                        <td><input type='text' value={inputsl} onChange={(e) => {
                            setInputSL(e.target.value.replace(/[^0-9.]/g, ''))

                        }} onBlur={() => {
                            const sl = parseFloat(inputsl)
                            if (!isNaN(sl)) {
                                setSL(sl);
                                setInputSL(sl.toString())
                            }else{
                                setInputSL('0')
                                setSL(0)
                            }
                        }} /></td>
                        <td><input type='text' value={inputtp} onChange={(e) => {
                            setInputTP(e.target.value.replace(/[^0-9.]/g, ''))
                        }} onBlur={() => {
                            const tp = parseFloat(inputtp)
                            if (!isNaN(tp)) {
                                setTP(tp);
                                setInputTP(tp.toString())
                            }else{
                                setInputTP('0')
                                setTP(0)
                            }
                        }} /></td>


                    </tr>
                </tbody>
            </table>
            <Button type="primary" onClick={handleSubmit}>提交</Button>

        </div>
    )
}

export default TradeContent