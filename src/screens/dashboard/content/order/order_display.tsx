import { OrderInfo } from "ObjectClass";
import { cancelOrder, closeOrder, logout } from "api";
import { FC, useState } from "react";
import { Dropdown, Menu, Space, Notification, TableColumnProps, Table, Collapse } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import './order_display.css'
import { useNavigate } from "react-router-dom";
import React from 'react';
import ModifyOrder from "./modify_order";
import ModifySLTP from "./modify_sltp";
const CollapseItem = Collapse.Item;
interface SwapOrderTableProps {
    title: string;
    orders: OrderInfo[];
    refreshData: React.Dispatch<React.SetStateAction<boolean>>
}

const SwapOrderTable: FC<SwapOrderTableProps> = ({ title, orders, refreshData }) => {
    const navigate = useNavigate();
    const [isModifyOrderVisible, setModifyOrderVisible] = useState(false);
    const [isModifySLTPVisible, setModifySLTPVisible] = useState(false);
    const [order, setOrder] = useState<OrderInfo>()
    let dropList: React.ReactNode = null;
    const handleOrderClick = async (key: Number, order: OrderInfo) => {
        switch (key) {
            case 1:
                var response1 = await cancelOrder(order.id)
                if (response1.ok) {
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单删除成功',
                    })
                } else if (response1.status !== 200 && response1.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err1 = await response1.json()
                    console.log(err1)
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单删除失败',
                    })
                }
                refreshData(true)
                break;
            case 2:
                setOrder(order)
                setModifyOrderVisible(true)
                break;
            case 3:
                setOrder(order)
                setModifySLTPVisible(true)
                break;
            case 4:
                var response4 = await closeOrder(order.id)
                if (response4.ok) {
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单平仓成功',
                    })
                } else if (response4.status !== 200 && response4.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err4 = await response4.json()
                    console.log(err4)
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单平仓失败',
                    })
                }
                refreshData(true)
                break;
        }
    }
    const columns: TableColumnProps[] = [
        {
            title: 'Symbol',
            dataIndex: 'name',
        },
        {
            title: '头寸',
            dataIndex: 'size',
        },
        {
            title: '持仓方向',
            dataIndex: 'posSide',
        },
        {
            title: '保证金模式',
            dataIndex: 'marginMode',
        },
        {
            title: '均价',
            dataIndex: 'avg',
        }
        ,
        {
            title: '杠杆',
            dataIndex: 'lv',
        }
        ,
        {
            title: '止损',
            dataIndex: 'sl',
        }
        ,
        {
            title: '止盈',
            dataIndex: 'tp',
        }
        ,
        {
            title: '开单时间',
            dataIndex: 'time',
        }
        ,
        {
            title: '状态',
            dataIndex: 'state',
        },
        {
            title: '',
            dataIndex: 'btn',
        }
    ];
    const moment = require('moment-timezone');
    const currentBrowserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tableData = orders.map((order) => ({
        key: `${order.id}`,
        name: order.symbol,
        size: `${order.size_exec}/${order.size}`,
        posSide: order.posSide,
        marginMode: order.marginMode,
        avg: order.priceAvg?.toFixed(4),
        lv: order.leverage,
        sl: order.sl,
        tp: order.tp,
        time: moment.utc(order.openTime).tz(currentBrowserTimeZone).format('YYYY-MM-DD HH:mm:ss'),
        state: ((() => {
            switch (order.status) {
                case 0:
                    dropList = (
                        <Menu>
                            <Menu.Item key='1' onClick={() => handleOrderClick(1, order)}>删除订单</Menu.Item>
                            <Menu.Item key='2' onClick={() => handleOrderClick(2, order)}>修改订单</Menu.Item>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                        </Menu>
                    );
                    return <span>未成交</span>;
                case 1:
                    dropList = (
                        <Menu>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                            <Menu.Item key='4' onClick={() => handleOrderClick(4, order)}>平仓</Menu.Item>
                        </Menu>
                    );
                    return <span>已成交</span>;
                case 2:
                    dropList = (
                        <Menu>
                            <Menu.Item key='1' onClick={() => handleOrderClick(1, order)}>删除订单</Menu.Item>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                            <Menu.Item key='4' onClick={() => handleOrderClick(4, order)}>平仓</Menu.Item>
                        </Menu>
                    );
                    return <span>部分成交</span>;
                default:
                    return <span>order.status</span>; // 可选：处理其他状态
            }
        })()),
        btn: (<Space size='large' className='dropdown-demo'>
            <Dropdown.Button type='primary' droplist={dropList} icon={<IconDown />}>
                操作
            </Dropdown.Button>
        </Space>)


    }));
    return (
        <div>
            <h3 style={{ color: '#F54E4E' }}>{title}</h3>
            <Table columns={columns} data={tableData} hover={false} />
            <ModifyOrder visible={isModifyOrderVisible} setVisible={setModifyOrderVisible} order={order} refreshData={refreshData} />
            <ModifySLTP visible={isModifySLTPVisible} setVisible={setModifySLTPVisible} order={order} refreshData={refreshData} />
        </div>
    )
}
interface SpotOrderTableProps {
    title: string;
    orders: OrderInfo[];
    refreshData: React.Dispatch<React.SetStateAction<boolean>>
}

const SpotOrderTable: FC<SpotOrderTableProps> = ({ title, orders, refreshData }) => {
    const navigate = useNavigate();
    const [isModifyOrderVisible, setModifyOrderVisible] = useState(false);
    const [order, setOrder] = useState<OrderInfo>()
    const [isModifySLTPVisible, setModifySLTPVisible] = useState(false);
    const handleOrderClick = async (key: Number, order: OrderInfo) => {
        switch (key) {
            case 1:
                var response1 = await cancelOrder(order.id)
                if (response1.ok) {
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单删除成功',
                    })
                } else if (response1.status !== 200 && response1.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err1 = await response1.json()
                    console.log(err1)
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单删除失败',
                    })
                }
                refreshData(true)
                break;
            case 2:
                setOrder(order)
                setModifyOrderVisible(true)
                break;
            case 3:
                setOrder(order)
                setModifySLTPVisible(true)
                break;
            case 4:
                var response4 = await closeOrder(order.id)
                if (response4.ok) {
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单平仓成功',
                    })
                } else if (response4.status !== 200 && response4.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err4 = await response4.json()
                    console.log(err4)
                    Notification.info({
                        closable: false,
                        title: 'Notification',
                        content: '订单平仓失败',
                    })
                }
                refreshData(true)
                break;
        }
    }
    let dropList: React.ReactNode = null;
    const columns: TableColumnProps[] = [
        {
            title: 'Symbol',
            dataIndex: 'name',
        },
        {
            title: '头寸',
            dataIndex: 'size',
        },
        {
            title: '均价',
            dataIndex: 'avg',
        }

        ,
        {
            title: '止损',
            dataIndex: 'sl',
        }
        ,
        {
            title: '止盈',
            dataIndex: 'tp',
        }
        ,
        {
            title: '开单时间',
            dataIndex: 'time',
        }
        ,
        {
            title: '状态',
            dataIndex: 'state',
        },
        {
            title: '',
            dataIndex: 'btn',
        }
    ];
    const moment = require('moment-timezone');
    const currentBrowserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tableData = orders.map((order) => ({
        key: `${order.id}`,
        name: order.symbol,
        size: `${order.size_exec}/${order.size}`,
        avg: order.priceAvg?.toFixed(4),
        sl: order.sl,
        tp: order.tp,
        time: moment.utc(order.openTime).tz(currentBrowserTimeZone).format('YYYY-MM-DD HH:mm:ss'),
        state: ((() => {
            switch (order.status) {
                case 0:
                    dropList = (
                        <Menu>
                            <Menu.Item key='1' onClick={() => handleOrderClick(1, order)}>删除订单</Menu.Item>
                            <Menu.Item key='2' onClick={() => handleOrderClick(2, order)}>修改订单</Menu.Item>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                        </Menu>
                    );
                    return <span>未成交</span>;
                case 1:
                    dropList = (
                        <Menu>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                            <Menu.Item key='4' onClick={() => handleOrderClick(4, order)}>平仓</Menu.Item>
                        </Menu>
                    );
                    return <span>已成交</span>;
                case 2:
                    dropList = (
                        <Menu>
                            <Menu.Item key='1' onClick={() => handleOrderClick(1, order)}>删除订单</Menu.Item>
                            <Menu.Item key='3' onClick={() => handleOrderClick(3, order)}>修改止盈止损</Menu.Item>
                            <Menu.Item key='4' onClick={() => handleOrderClick(4, order)}>平仓</Menu.Item>
                        </Menu>
                    );
                    return <span>部分成交</span>;
                default:
                    return <span>order.status</span>; // 可选：处理其他状态
            }
        })()),
        btn: (<Space size='large' className='dropdown-demo'>
            <Dropdown.Button type='primary' droplist={dropList} icon={<IconDown />}>
                操作
            </Dropdown.Button>
        </Space>)


    }));
    return (
        <div>
            <h3 style={{ color: '#FF8D1F' }}>{title}</h3>
            <Table columns={columns} data={tableData} hover={false} />
            <ModifyOrder visible={isModifyOrderVisible} setVisible={setModifyOrderVisible} order={order} refreshData={refreshData} />
            <ModifySLTP visible={isModifySLTPVisible} setVisible={setModifySLTPVisible} order={order} refreshData={refreshData} />
        </div>
    )
}
interface OrderDisplayProps {
    id: number;
    name: string;
    accountName: string;
    spotOrders: OrderInfo[];
    swapOrders: OrderInfo[];
    refreshData: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderDisplay: FC<OrderDisplayProps> = ({ id, name, accountName, spotOrders, swapOrders, refreshData }) => {
    return (
        <Collapse>
            <CollapseItem header={`${id} 名字: ${name} 账户名：${accountName}`} name='1'>
                
                    <SpotOrderTable title="现货订单" orders={spotOrders} refreshData={refreshData} />
                    <SwapOrderTable title="合约订单" orders={swapOrders} refreshData={refreshData} />
                
            </CollapseItem>
        </Collapse>
    );
};

export default OrderDisplay