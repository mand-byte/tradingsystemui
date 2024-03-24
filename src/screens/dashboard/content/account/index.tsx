import { Exchange, StatisticsInfo } from "ObjectClass"
import { getAllAccounts, getStatistics, logout } from "api"
import React, { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Chart as ChartJS, CategoryScale } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { Divider, Select, Space, Table, TableColumnProps,Radio, Statistic } from "@arco-design/web-react"
import { OptionInfo } from "@arco-design/web-react/es/Select/interface"

const RadioGroup = Radio.Group;
ChartJS.register(CategoryScale)
interface AccountContentProp {
    exchanges: Exchange[]
}
const AccountContent: FC<AccountContentProp> = ({ exchanges }) => {
    const navigate = useNavigate();

    const [selectedOptions, setSelectedOptions] = useState(0);
    const [selectedDay, setSelectedDay] = useState(7);
    const [options, setOptions] = useState<any>();
    const [chart,setChart]=useState<any>();
    const [total,setTotal]=useState<number>(0)
    const [tabledata,setTableData]=useState<any>({})
    useEffect(() => {
        const getAllAccountInfo = async () => {
            var response = await getAllAccounts()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    const swapaccounts=result['data']['swap']
                    const spotaccounts=result['data']['spot']
                   
                    const tableData = exchanges.map((ex) => ({
                        key: `${ex.id}`,
                        name: `${ex.ex}-${ex.account}`,
                        total: swapaccounts[ex.id]?.total.toFixed(2) || 0,
                        available: swapaccounts[ex.id]?.available.toFixed(2) || 0,
                        locked: swapaccounts[ex.id]?.unrealizedPL.toFixed(2) || 0,
                        spot: spotaccounts[ex.id]?.total.toFixed(2) || 0,
                        spotavailable: spotaccounts[ex.id]?.available.toFixed(2) || 0,
                        spotlocked: spotaccounts[ex.id]?.unrealizedPL.toFixed(2) || 0,
                        funding : spotaccounts[ex.id]?.funding.toFixed(2) || 0,
                        all: ((swapaccounts[ex.id]?.total || 0) + (spotaccounts[ex.id]?.total || 0) + (spotaccounts[ex.id]?.unrealizedPL || 0)+ (spotaccounts[ex.id]?.funding || 0)).toFixed(2),
                
                    }));

                    setTableData(tableData)
                    let totalAll = 0;
                    tableData.forEach((data) => {
                        totalAll += parseFloat(data.all);
                    });
                    setTotal(totalAll)
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    console.log(err)
                }
            }
        }
        const initialOptions = exchanges.map((ex) => ({
            value: `${ex.id}`,
            label: `${ex.ex}-${ex.account}`,
        }));
        initialOptions.push({ value: "0", label: '全部' })
        setOptions(initialOptions)
        getAllAccountInfo()
    }, [navigate,exchanges])
    useEffect(()=>{
        const getStatisticsInfo = async () => {
            var response = await getStatistics(selectedOptions,selectedDay)
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    var data = result['data']
                    var statistics_: { [key: number]: StatisticsInfo[] } = {}
                    for (var s in data) {
                        var id = data[s].exId as number
                        if (id in statistics_) {
                            statistics_[id].push(data[s])
                        } else {
                            statistics_[id] = [data[s]]
                        }
                    }
                    const getExById = (id: number) => exchanges.find(item => item.id === id);
                    const selectedEx = getExById(selectedOptions);
                    const currentBrowserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const moment = require('moment-timezone');
                    const chartData = {
                        labels: statistics_[selectedOptions].map(entry=>moment.utc(entry.datetime).tz(currentBrowserTimeZone).format('YYYY-MM-DD HH:mm:ss')),
                        datasets: [{
                            label: selectedOptions === 0 ? '全部' : `${selectedEx?.account} ${selectedEx?.ex}`,
                            data: statistics_[selectedOptions].map(entry=>entry.money),
                            borderColor: '#5EDFD6',
                            fill: false,
                        }],
                    };
                    setChart(chartData)
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    console.log(err)
                }
            }
        }
    getStatisticsInfo()
    },[selectedOptions,selectedDay,navigate,exchanges])
 
    
    
   
    const columns: TableColumnProps[] = [
        {
            title: '交易所-账户',
            dataIndex: 'name',
        },
        {
            title: '合约usdt全部',
            dataIndex: 'total',
        },
        {
            title: '合约usdt可用',
            dataIndex: 'available',
        },
        {
            title: '合约未实现收益',
            dataIndex: 'locked',
        },
        {
            title: '现货usdt全部',
            dataIndex: 'spot',
        }
        ,
        {
            title: '现货usdt可用',
            dataIndex: 'spotavailable',
        }
        ,
        {
            title: '现货总价值',
            dataIndex: 'spotlocked',
        }
        ,
        {
            title: '理财/资金',
            dataIndex: 'funding',
        }
        ,
        {
            title: '总资产',
            dataIndex: 'all',
        }
    ];

    
    const handleSelect = (value: any, option: OptionInfo | OptionInfo[]) => {
        setSelectedOptions(parseInt(value))
    }
    const handleSelectDay=(value:any)=>{
        setSelectedDay(parseInt(value))
    }
    // 准备表格数据
    
    if (chart===undefined) {
        return <div>No data to display.</div>;
    }
    return (
        <div>
            {/* 表格 */}
            <Table columns={columns} data={tabledata} hover={false} />
            <Statistic title='所有账户总额' value={total.toFixed(2)} groupSeparator style={{ marginRight: 60,background:'black' }} />
            {/* 曲线图 */}
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Space size='large' direction='horizontal'>
                <Select
                    placeholder='Please select'
                    defaultValue='0'
                    style={{ width: 345, background: 'black' }}
                    options={options}
                    onChange={handleSelect}
                >

                </Select>
                <RadioGroup defaultValue='7' style={{ marginBottom: 20 ,background: 'black'}} onChange={handleSelectDay}>
                    <Radio value='7'>7天</Radio>
                    <Radio value='30'>30天</Radio>
                    <Radio value='90'>90天</Radio>
                </RadioGroup>
            </Space>
            <Chart data={chart} type={"line"} />
        </div>
    )
}
export default AccountContent