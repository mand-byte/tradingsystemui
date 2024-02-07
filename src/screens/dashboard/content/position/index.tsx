import { Exchange, OrderInfo, SpotPosition, SwapPosition } from "ObjectClass"
import { getAllPositions, logout } from "api"
import { FC, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import PositionDisplay from "./position_display"
import React from 'react';
import { Divider } from "@arco-design/web-react"
import ModifySLTP from "../order/modify_sltp"
interface PositionContentProp {
    exchanges: Exchange[]
}

const PositionContent: FC<PositionContentProp> = ({ exchanges }) => {
    const [swapPositions, setSwapPositions] = useState<{ [key: number]: SwapPosition[] }>({})
    const [spotPositions, setSpotPositions] = useState<{ [key: number]: SpotPosition[] }>([])
    const navigate = useNavigate()
    const [refreshData, setRefreshOrderData] = useState(false);
    const isInitialMount = useRef(true);
    const [isModifySLTPVisible, setModifySLTPVisible] = useState(false);
    const [SLTPData,setSLTPData]=useState<OrderInfo|undefined>()
    useEffect(() => {
        const getPositions = async () => {
            var response = await getAllPositions()
            if (response) {
                if (response.ok) {
                    var result = await response.json()

                    setSwapPositions(result['data']['swap'])
                    setSpotPositions(result['data']['spot'])
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
            getPositions();
            // Reset refreshData to false after fetching
            setRefreshOrderData(false);
        }
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, [navigate,refreshData])

    if (Object.keys(exchanges).length === 0) {
        return <div>No data to display.</div>;
    }
    const getSwapPositionsById = (id: number) => swapPositions[id] || [];

    // 从 spotPositions 中获取对应的 spotPositions 数据
    const getSpotPositionsById = (id: number) => spotPositions[id] || [];
    return (
        <>
            {exchanges.map((ex) => (
           <>
            <PositionDisplay
                key={ex.id}
                id={ex.id}
                name={ex.ex || 'Unknown'}
                accountName={ex.account || 'Unknown'}
                spotPositions={getSpotPositionsById(ex.id)}
                swapPositions={getSwapPositionsById(ex.id)}
                setRefreshOrderData={setRefreshOrderData}
                setSLTPData={setSLTPData}
                setModifySLTPVisible={setModifySLTPVisible}
            />
            <Divider
          style={{
            borderBottomWidth: 2,
            borderBottomStyle: 'dotted',
          }}
        />
            </>
            
      ))}
      <ModifySLTP visible={isModifySLTPVisible} setVisible={setModifySLTPVisible} order={SLTPData} refreshData={setRefreshOrderData} />
        </>

    )
}

export default PositionContent