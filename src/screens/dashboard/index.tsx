import { useEffect, useState } from "react"
import MainContent from "./content"
import Foot from "./foot"
import { PanelType } from "Enum"
import { Exchange } from "ObjectClass"
import { getAllExchanges, logout } from "api"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css";
import React from 'react';
const Dashboard = () => {
    const [footMenuState, setFootMenuState] = useState(PanelType.ACCOUNT)
    const [exchanges, setExchanges] = useState<Exchange[]>([])
    const navigate = useNavigate();
    useEffect(() => {
        const allExchanges = async () => {
            var response = await getAllExchanges()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    setExchanges(result['data']);
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    console.log(err)
                }
            }
        }
        allExchanges()
    }, [navigate])

    return (
        <div className="main-and-foot-container">
            {exchanges.length >= 0 && <MainContent type={footMenuState} exchanges={exchanges} />}
            <Foot setFootMenuState={setFootMenuState} />
        </div>
    )
}
export default Dashboard