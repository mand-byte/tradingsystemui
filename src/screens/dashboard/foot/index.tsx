
import { PanelType } from "Enum";
import { FC } from "react";
import React from 'react';

interface FootProps {
  setFootMenuState: (menuState: PanelType) => void;
}
const Foot: FC<FootProps> = ({ setFootMenuState }) => {
  const handleMenuClick = (menuState: PanelType) => {
    setFootMenuState(menuState);
  };

  return (
    <div className="foot-container">
      <button onClick={() => handleMenuClick(PanelType.ACCOUNT)}>账户</button>
      <button onClick={() => handleMenuClick(PanelType.POSITION)}>持仓</button>
      <button onClick={() => handleMenuClick(PanelType.ORDERS)}>订单</button>
      <button onClick={() => handleMenuClick(PanelType.TRADE)}>开仓</button>
      <button onClick={() => handleMenuClick(PanelType.SETTING)}>设置</button>
    </div>
  )
}

export default Foot;