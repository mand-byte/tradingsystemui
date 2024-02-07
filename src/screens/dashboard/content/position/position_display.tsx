import { OrderInfo, SpotPosition, SwapPosition } from 'ObjectClass';
import { closePosition, logout } from 'api';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Collapse, Notification, Table, TableColumnProps } from '@arco-design/web-react';
const CollapseItem = Collapse.Item;
interface SpotPositionTableProps {
  exid: number
  title: string;
  positions: SpotPosition[];
  setRefreshOrderData: React.Dispatch<React.SetStateAction<boolean>>
  setSLTPData:React.Dispatch<React.SetStateAction<OrderInfo|undefined>>
  setModifySLTPVisible:React.Dispatch<React.SetStateAction<boolean>>
}


const SpotPositionTable: FC<SpotPositionTableProps> = ({ exid, title, positions, setRefreshOrderData,setSLTPData,setModifySLTPVisible }) => {
  const navigate = useNavigate();
  const handleClosePos = async (exid: number, symbol: string, posSide?: string) => {
    var response = await closePosition(exid, symbol, posSide)
    if (response.ok) {
      Notification.success({
        title: 'success',
        content: "平仓成功",
      })
    } else if (response.status !== 200 && response.status < 405) {
      await logout()
      navigate('/login')
    } else {
      var err = await response.json()
      console.log(err)
      Notification.error({
        title: 'error',
        content: JSON.stringify(err),
      })
    }
    setRefreshOrderData(true)
  }
  const columns: TableColumnProps[] = [
    {
      title: 'Symbol',
      dataIndex: 'name',
    },
    {
      title: '头寸',
      dataIndex: 'total',
    },
    {
      title: '可用',
      dataIndex: 'available',
    },
    {
      title: '未实现盈利',
      dataIndex: 'locked',
    },
    {
      title: '',
      dataIndex: 'btn',
    },
    {
      title: '',
      dataIndex: 'sltpbtn',
    }
  ]
  const handleModifySlTPPos=async (exid:number,symbol:string)=>{
    setModifySLTPVisible(true)
    setSLTPData({id:0,ex:exid,symbol:symbol,isswap:false})
  }
  const tableData = positions.map((position) => ({
    key: `${position.symbol}`,
    name: `${position.symbol}`,
    total: position.total.toFixed(4),
    available: position.available.toFixed(4),
    locked: position.unrealizedPL.toFixed(4),
    btn: (<Button shape='round' type='primary' onClick={() => handleClosePos(exid, position.symbol)}>平仓</Button>),
    sltpbtn:(<Button shape='round' type='primary' onClick={() => handleModifySlTPPos(exid, position.symbol)}>设置sltp</Button>)
  }));
  return (
    <div>
      <h3 style={{ color: '#FF8D1F' }}>{title}</h3>
      <Table columns={columns} data={tableData} hover={false} />
    </div>
  );
};

interface SwapPositionTableProps {
  exid: number
  title: string;
  positions: SwapPosition[];
  setRefreshOrderData: React.Dispatch<React.SetStateAction<boolean>>
  setSLTPData:React.Dispatch<React.SetStateAction<OrderInfo|undefined>>
  setModifySLTPVisible:React.Dispatch<React.SetStateAction<boolean>>
}

const SwapPositionTable: FC<SwapPositionTableProps> = ({ exid, title, positions, setRefreshOrderData ,setSLTPData,setModifySLTPVisible}) => {
  const navigate = useNavigate();
  const handleClosePos = async (exid: number, symbol: string, posSide?: string) => {
    var response = await closePosition(exid, symbol, posSide)
    if (response.ok) {
      Notification.success({
        title: 'success',
        content: "平仓成功",
      })
    } else if (response.status !== 200 && response.status < 405) {
      await logout()
      navigate('/login')
    } else {
      var err = await response.json()
      console.log(err)
      Notification.error({
        title: 'error',
        content: JSON.stringify(err),
      })
    }
    setRefreshOrderData(true)
  }
  const handleModifySlTPPos=async (exid:number,symbol:string,posSide?:string)=>{
    setModifySLTPVisible(true)
    setSLTPData({id:0,ex:exid,symbol:symbol,posSide:posSide,isswap:true})
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
      title: '未实现盈利',
      dataIndex: 'upl',
    },
    {
      title: '保证金',
      dataIndex: 'margin',
    },
    {
      title: '保证金模式',
      dataIndex: 'marginMode',
    },
    {
      title: '均价',
      dataIndex: 'priceAvg',
    },
    {
      title: '杠杆',
      dataIndex: 'leverage',
    },
    {
      title: '',
      dataIndex: 'btn',
    }
    ,
    {
      title: '',
      dataIndex: 'sltpbtn',
    }
  ]
  const tableData = positions.map((position) => ({
    key: `${position.symbol}`,
    name: `${position.symbol}`,
    size: position.size,
    posSide: position.posSide,
    upl: position.upl.toFixed(4),
    margin: position.margin.toFixed(4),
    marginMode: position.marginMode,
    priceAvg: position.priceAvg.toFixed(4),
    leverage: position.leverage,
    btn: (<Button shape='round' type='primary' onClick={() => handleClosePos(exid, position.symbol, position.posSide)}>平仓</Button>),
    sltpbtn:(<Button shape='round' type='primary' onClick={() => handleModifySlTPPos(exid, position.symbol, position.posSide)}>设置sltp</Button>)
  }));
  return (
    <div>
      <h3 style={{ color: '#F54E4E' }}>{title}</h3>

      <Table columns={columns} data={tableData} hover={false} />
    </div>
  );
};

interface PositionDisplayProps {
  id: number;
  name: string;
  accountName: string;
  spotPositions: SpotPosition[];
  swapPositions: SwapPosition[];
  setRefreshOrderData: React.Dispatch<React.SetStateAction<boolean>>
  setSLTPData:React.Dispatch<React.SetStateAction<OrderInfo|undefined>>
  setModifySLTPVisible:React.Dispatch<React.SetStateAction<boolean>>
}

const PositionDisplay: FC<PositionDisplayProps> = ({ id, name, accountName, spotPositions, swapPositions, setRefreshOrderData ,setSLTPData,setModifySLTPVisible}) => {
  return (

    <Collapse>
      <CollapseItem header={`${id} 名字: ${name} 账户名：${accountName}`} name='1'>
        
      <SpotPositionTable exid={id} title="现货持仓" positions={spotPositions} setRefreshOrderData={setRefreshOrderData} setSLTPData={setSLTPData} setModifySLTPVisible={setModifySLTPVisible}/>
      <SwapPositionTable exid={id} title="合约持仓" positions={swapPositions} setRefreshOrderData={setRefreshOrderData} setSLTPData={setSLTPData} setModifySLTPVisible={setModifySLTPVisible}/>
      

      </CollapseItem>
    </Collapse>
  );
};

export default PositionDisplay