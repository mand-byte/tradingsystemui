import { PanelType } from "Enum"
import { Exchange } from "ObjectClass"
import { FC } from "react"
import AccountContent from "./account"
import PositionContent from "./position"
import OrderContent from "./order"
import TradeContent from "./trade"
import React from 'react';
import SettingContent from "./setting"
interface MainContentProp {
    type: PanelType
    exchanges: Exchange[]
}

const MainContent: FC<MainContentProp> = ({ type,  exchanges }) => {
    if (exchanges.length===0) {
        return <div>No data to display.</div>;
    }
    return (
        <>
            {type === PanelType.ACCOUNT && (
                <div>
                    {/* Render Account Container with selectedExchangeIds */}
                    <AccountContent exchanges={exchanges} />
                </div>
            )}
            {type === PanelType.POSITION && (
                <div>
                    {/* Render Position Container with selectedExchangeIds */}
                    <PositionContent  exchanges={exchanges} />
                </div>
            )}
            {type === PanelType.ORDERS && (
                <div>
                    {/* Render Order Container with selectedExchangeIds */}
                    <OrderContent  exchanges={exchanges} />
                </div>
            )}
            {type === PanelType.TRADE && (
                <div>
                    {/* Render Trade Container with selectedExchangeIds */}
                    <TradeContent  exchanges={exchanges} />
                </div>
            )}
            {type === PanelType.SETTING && (
                <div>
                    {/* Render Trade Container with selectedExchangeIds */}
                    <SettingContent   />
                </div>
            )}
        </>
    )
}

export default MainContent