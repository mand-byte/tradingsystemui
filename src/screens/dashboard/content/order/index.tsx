import { Exchange, OrderInfo } from "ObjectClass"
import { getAllOrders, logout } from "api"
import { FC, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import OrderDisplay from "./order_display"
import React from 'react';
import { Divider } from "@arco-design/web-react"
interface OrderContentProp {
    exchanges: Exchange[]
}

const OrderContent: FC<OrderContentProp> = ({ exchanges }) => {
    const [spotOrders, setSpotOrders] = useState<{ [key: number]: OrderInfo[] }>({})
    const [swapOrders, setSwapOrders] = useState<{ [key: number]: OrderInfo[] }>({})
    const navigate = useNavigate();
    const [refreshData, setRefreshOrderData] = useState(false);
    const isInitialMount = useRef(true);
    useEffect(() => {
        const getOrders = async () => {
            const response = await getAllOrders()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    var spots: { [key: number]: OrderInfo[] } = {}
                    var swaps: { [key: number]: OrderInfo[] } = {}
                    var data = result['data']
                    data.forEach((element: OrderInfo) => {
                        var exid = element?.ex
                        if (element.isswap) {
                            if (exid in swaps) {
                                swaps[exid].push(element)
                            } else {
                                swaps[exid] = [element]
                            }
                        } else {
                            if (exid in spots) {
                                spots[exid].push(element)
                            } else {
                                spots[exid] = [element]
                            }
                        }
                    });

                    setSpotOrders(spots)
                    setSwapOrders(swaps)
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    console.log(err)
                }
            }
        }
        if (refreshData || isInitialMount.current) {
            getOrders();
            // Reset refreshData to false after fetching
            setRefreshOrderData(false);
        }
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, [navigate, refreshData])
    if (Object.keys(exchanges).length === 0) {
        return <div>No data to display.</div>;
    }
    const getSwapOrdersById = (id: number) => swapOrders[id] || [];

    const getSpotOrdersById = (id: number) => spotOrders[id] || [];
    return (
        <>
            {exchanges.map((ex) => (
                <>
                <OrderDisplay
                    key={ex.id}
                    id={ex.id}
                    name={ex.ex || 'Unknown'}
                    accountName={ex.account || 'Unknown'}
                    spotOrders={getSpotOrdersById(ex.id)}
                    swapOrders={getSwapOrdersById(ex.id)}
                    refreshData={setRefreshOrderData}
                />
                 <Divider
          style={{
            borderBottomWidth: 2,
            borderBottomStyle: 'dotted',
          }}
        />
                </>
            ))}
        </>
    )
}

export default OrderContent