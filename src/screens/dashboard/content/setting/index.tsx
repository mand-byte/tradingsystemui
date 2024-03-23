import { AddExchange, GetExList, GetSetting, SetExchangeStatus, SetExchangeTVSingal, SetLeverage, SetMartin, SetProfitTrans, SetTG, SetTrend, logout } from "api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Form, Input, InputNumber, Message, Notification, Select, Switch, Table, TableColumnProps } from '@arco-design/web-react';
const FormItem = Form.Item;
const SettingContent: React.FC = () => {
    const navigate = useNavigate();
    const [refreshEx, setRefreshEx] = useState(true)
    const [tableData, setTableData] = useState<any>([])
    const exformRef = useRef<any>();

    const [tg_err_check, set_tg_err_Check] = useState(false)
    const [tg_open_check, set_tg_open_Check] = useState(false)
    const [tg_close_check, set_tg_close_Check] = useState(false)
    const [leverage, setLeverage] = useState(0)

    const [martinMaxCount, setMartinMaxCount] = useState(0)
    const [martinExceptNum, setMartinExceptNum] = useState(1)
    const [martinRatio, setMartinRatio] = useState<boolean>(false)
    const [martinRatioMoney, setMartinRatioMoney] = useState<number>(0.008)
    const [martinFixedMoney1, setMartinFixedMoney1] = useState<number>(10)
    const [martinFixedMoney2, setMartinFixedMoney2] = useState<number>(16.18)
    const [martinFixedMoney3, setMartinFixedMoney3] = useState<number>(26.18)
    const [martinFixedMoney4, setMartinFixedMoney4] = useState<number>(42.36)

    const [trendRatio, setTrendRatio] = useState<boolean>(false)
    const [trendRatioInvest, setTrendRatioInvest] = useState<number>(0.1)
    const [trendFixedInvest, setTrendFixedInvest] = useState<number>(150)
    const [trendTP, setTrendTP] = useState<number>(0.025)
    const [trendSL, setTrendSL] = useState<number>(0.025)
    const [profitTransfer,setProfitTransfer]=useState<number>(0.4)
    useEffect(() => {
        const handle_ex_status = async (id: number, status: number) => {
            var response = await SetExchangeStatus(id, status)
            if (response) {
                if (response.ok) {
                    setRefreshEx(!refreshEx)
                    Notification.success({
                        title: 'success',
                        content: "设置交易所状态成功",
                    })
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    Notification.error({
                        title: 'error',
                        content: JSON.stringify(err),
                    })
                }
            }
        }
        const handle_ex_tvsingal = async (id: number, no_open: number, no_close: number) => {
            var response = await SetExchangeTVSingal(id, no_open, no_close)
            if (response) {
                if (response.ok) {
                    setRefreshEx(!refreshEx)
                    Notification.success({
                        title: 'success',
                        content: "设置交易所tv信号成功",
                    })
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    Notification.error({
                        title: 'error',
                        content: JSON.stringify(err),
                    })
                }
            }
        }
        const GetEx = async () => {
            var response = await GetExList()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    const _tabledata = result['data'].map((ex: {
                        deleted: boolean
                        account: string
                        ex: string
                        id: number
                        no_close: number
                        no_open: number
                    }) => ({
                        id: ex.id,
                        ex: ex.ex,
                        account: ex.account,
                        no_open: (<Button shape='round' type='primary' onClick={() => handle_ex_tvsingal(ex.id, ex.no_open === 0 ? 1 : 0, ex.no_close)}>{ex.no_open === 1 ? '恢复' : '禁用'}</Button>),
                        no_close: (<Button shape='round' type='primary' onClick={() => handle_ex_tvsingal(ex.id, ex.no_open, ex.no_close === 0 ? 1 : 0)}>{ex.no_close === 1 ? '恢复' : '禁用'}</Button>),
                        btn: (<Button shape='round' type='primary' onClick={() => handle_ex_status(ex.id, ex.deleted ? 0 : 1)}>{ex.deleted ? '恢复' : '禁用'}</Button>),
                        btn2: (<Button shape='round' type='primary' onClick={() => handle_ex_status(ex.id, 2)}>永久删除</Button>)
                    }))
                    setTableData(_tabledata)
                }
                else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    Notification.error({
                        title: 'error',
                        content: JSON.stringify(err),
                    })
                }
            }
        }

        GetEx()
    }, [navigate, refreshEx])

    useEffect(() => {
        const getSetting = async () => {
            var response = await GetSetting()
            if (response) {
                if (response.ok) {
                    var result = await response.json()
                    set_tg_err_Check(result['data']["TG_report_err"])
                    set_tg_open_Check(result['data']["TG_report_open"])
                    set_tg_close_Check(result['data']["TG_report_close"])
                    setLeverage(result['data']['LEVERAGE'])

                    setMartinMaxCount(result['data']['Martin']['MAX_HUOXING_COUNT'])
                    setMartinExceptNum(result['data']['Martin']['HUOXING_EXCEPT_NUM'])
                    setMartinRatio(result['data']['Martin']['HUOXING_INVEST_USE_RATIO'])
                    setMartinRatioMoney(result['data']['Martin']['HUOXING_RATIO_INVEST'])
                    setMartinFixedMoney1(result['data']['Martin']['HUOXING_FIXED_INVERST'][0])
                    setMartinFixedMoney2(result['data']['Martin']['HUOXING_FIXED_INVERST'][1])
                    setMartinFixedMoney3(result['data']['Martin']['HUOXING_FIXED_INVERST'][2])
                    setMartinFixedMoney4(result['data']['Martin']['HUOXING_FIXED_INVERST'][3])

                    setTrendRatio(result['data']['Trend']['TREND_INVEST_USE_RATIO'])
                    setTrendRatioInvest(result['data']['Trend']['TREND_RATIO_INVEST'])
                    setTrendFixedInvest(result['data']['Trend']['TREND_FIXED_INVEST'])
                    setTrendTP(result['data']['Trend']['TREND_TP_RATIO'])
                    setTrendSL(result['data']['Trend']['TREND_SL_RATIO'])
                    setProfitTransfer(result['data']['TransferProfit'])
                } else if (response.status !== 200 && response.status < 405) {
                    await logout()
                    navigate('/login')
                } else {
                    var err = await response.json()
                    Notification.error({
                        title: 'error',
                        content: JSON.stringify(err),
                    })
                }
            }
        }
        getSetting()
    }, [navigate])

    const HandleAddExchange = async (ex: string, account: string, apikey: string, api_secret: string, api_passwd: string) => {
        const response = await AddExchange({ ex: ex, account: account, apikey: apikey, api_secret: api_secret, api_password: api_passwd })
        if (response) {
            if (response.ok) {
                setRefreshEx(!refreshEx)
                Notification.success({
                    title: 'success',
                    content: "添加交易所信息成功",
                })
            } else if (response.status !== 200 && response.status < 405) {
                await logout()
                navigate('/login')
            } else {
                var err = await response.json()
                Notification.error({
                    title: 'error',
                    content: JSON.stringify(err),
                })
            }
        }
    }

    const columns: TableColumnProps[] = [
        {
            title: 'id',
            dataIndex: 'id',
        },
        {
            title: '交易所',
            dataIndex: 'ex',
        },
        {
            title: '账户/别名',
            dataIndex: 'account',
        },
        {
            title: '是否监听tv开仓',
            dataIndex: 'no_open',
        },
        {
            title: '是否监听tv平仓',
            dataIndex: 'no_close',
        },
        {
            title: '使用禁用',
            dataIndex: 'btn',
        }
        ,
        {
            title: '',
            dataIndex: 'btn2',
        }
    ]
    if (leverage === 0) {
        return <div>No data to display.</div>;
    }
    return (
        <div>
            <Table columns={columns} data={tableData} hover={false} />
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Form ref={exformRef}
                autoComplete='off'
                size='mini'
                style={{ background: 'black' }}
                scrollToFirstError
            >
                <FormItem label='交易所' field='ex'>
                    <Select
                        placeholder='select exchange'
                        options={['binance', 'okx', 'bitget','nexo']}
                        style={{ width: 154 }}
                    />
                </FormItem>
                <FormItem label='账户或昵称' field='account'>
                    <Input placeholder='please enter account name or nickname...' style={{ width: 354 }} />
                </FormItem>
                <FormItem label='apikey' field='apikey'>
                    <Input placeholder='please enter api key...' style={{ width: 354 }} />
                </FormItem>
                <FormItem label='api_secret' field='api_secret'>
                    <Input placeholder='please enter api secret...' style={{ width: 354 }} />
                </FormItem>
                <FormItem label='api_passwd' field='api_passwd'>
                    <Input placeholder='please enter api passwd if you have...' style={{ width: 354 }} />
                </FormItem>
                <FormItem >
                    <Button
                        onClick={async () => {
                            if (exformRef.current) {
                                const ex = exformRef.current.getFieldValue("ex")
                                if (ex === undefined) {
                                    Message.error('请选择交易所');
                                    return
                                }
                                const account = exformRef.current.getFieldValue("account")
                                if (account === undefined) {
                                    Message.error('请输入账户或昵称');
                                    return
                                }
                                const apikey = exformRef.current.getFieldValue("apikey")
                                if (apikey === undefined) {
                                    Message.error('请输入交易所的apikey');
                                    return
                                }
                                const api_secret = exformRef.current.getFieldValue("api_secret")
                                if (api_secret === undefined) {
                                    Message.error('请输入交易所的api_secret');
                                    return
                                }
                                const passwd = exformRef.current.getFieldValue("api_passwd")
                                HandleAddExchange(ex, account, apikey, api_secret, passwd === undefined ? '' : passwd)

                            }
                        }}
                        type='primary'

                    >
                        添加交易所配置
                    </Button>
                </FormItem>
            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Form
                autoComplete='off'
                size='mini'
                style={{ background: 'black', width: '100%' }}
                scrollToFirstError
                layout="inline"
            >
                <FormItem label='tg通知错误' field='TG_report_err' >
                    <Switch checked={tg_err_check} onChange={(value: boolean) => {
                        set_tg_err_Check(value)
                    }} />
                </FormItem>
                <FormItem label='tg通知开仓' field='TG_report_open'>
                    <Switch checked={tg_open_check} onChange={(value: boolean) => {
                        set_tg_open_Check(value)
                    }} />
                </FormItem>
                <FormItem label='tg通知关仓' field='TG_report_close'>
                    <Switch checked={tg_close_check} onChange={(value: boolean) => {
                        set_tg_close_Check(value)
                    }} />
                </FormItem>
                <FormItem>
                    <Button
                        onClick={async () => {
                            const response = await SetTG(tg_err_check, tg_open_check, tg_close_check)
                            if (response) {
                                if (response.ok) {
                                    Notification.success({
                                        title: 'success',
                                        content: "tg设置成功",
                                    })
                                } else if (response.status !== 200 && response.status < 405) {
                                    await logout()
                                    navigate('/login')
                                } else {
                                    var err = await response.json()
                                    Notification.error({
                                        title: 'error',
                                        content: JSON.stringify(err),
                                    })
                                }
                            }
                        }}
                        type='primary'>
                        保存tg配置
                    </Button>

                </FormItem>

            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Form
                autoComplete='off'
                size='mini'
                style={{ background: 'black', width: '100%' }}
                scrollToFirstError
                layout="inline"
            >
                <FormItem label='设置杠杆' field='leverage' >
                    <InputNumber defaultValue={leverage} placeholder={leverage.toString()} style={{ width: 100 }} min={1}
                        max={100} step={1}
                        precision={0}
                        onChange={(value) => {
                            setLeverage(value)
                        }}
                    />

                </FormItem>
                <FormItem>
                    <Button
                        onClick={async () => {
                            const response = await SetLeverage(leverage)
                            if (response) {
                                if (response.ok) {
                                    Notification.success({
                                        title: 'success',
                                        content: "杠杆设置成功",
                                    })
                                } else if (response.status !== 200 && response.status < 405) {
                                    await logout()
                                    navigate('/login')
                                } else {
                                    var err = await response.json()
                                    Notification.error({
                                        title: 'error',
                                        content: JSON.stringify(err),
                                    })
                                }
                            }
                        }}
                        type='primary'
                    >
                        提交
                    </Button>
                </FormItem>
            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Form
                autoComplete='off'
                size='mini'
                style={{ background: 'black', width: '100%' }}
                scrollToFirstError
                layout="inline"
            >
                <FormItem label='同一方向最大同时持仓标的个数' field='max_count' tooltip='0为不限制单一方向开单个数'>
                    <InputNumber defaultValue={martinMaxCount} placeholder={martinMaxCount.toString()} style={{ width: 40 }} min={0}
                        max={100} step={1}
                        precision={0}
                        onChange={(value) => {
                            setMartinMaxCount(value)
                        }}
                    />
                </FormItem>
                {martinMaxCount > 0 && (
                    <FormItem label='排除马丁级数' field='except_num' tooltip='当收到马丁级数大于此值的tv信号时不受同一方向最大个数限制'>

                        <InputNumber defaultValue={martinExceptNum} placeholder={martinExceptNum.toString()} style={{ width: 40 }} min={1}
                            max={4} step={1}
                            precision={0}
                            onChange={(value) => {
                                setMartinExceptNum(value)
                            }}
                        />
                    </FormItem>
                )}


                <FormItem label='马丁按本金比例投入' field='use_ratio' >
                    <Switch checked={martinRatio} onChange={(value: boolean) => {
                        setMartinRatio(value)
                    }} />
                </FormItem>
                {martinRatio && (
                    <FormItem label='账户总金额比例' field='invest_ratio' tooltip='实际投入usdt价值为账户总金额*此比例值*1.618的n次幂'>

                        <InputNumber defaultValue={martinRatioMoney} placeholder={martinRatioMoney.toString()} style={{ width: 100 }} min={0.000001}
                            max={10} step={0.00001}
                            precision={5}
                            onChange={(value) => {
                                setMartinRatioMoney(value)
                            }}
                        />
                    </FormItem>
                )}
                {!martinRatio && (
                    <FormItem label='马丁固定投入值' field='invest_fixed' tooltip='实际投入usdt价值为此固定值'>

                        <InputNumber defaultValue={martinFixedMoney1} placeholder={martinFixedMoney1.toString()} style={{ width: 100 }} min={10}
                            step={0.01}
                            precision={2}
                            onChange={(value) => {
                                setMartinFixedMoney1(value)
                            }}
                        />
                        <InputNumber defaultValue={martinFixedMoney2} placeholder={martinFixedMoney2.toString()} style={{ width: 100 }} min={10}
                            step={0.01}
                            precision={2}
                            onChange={(value) => {
                                setMartinFixedMoney2(value)
                            }}
                        />
                        <InputNumber defaultValue={martinFixedMoney3} placeholder={martinFixedMoney3.toString()} style={{ width: 100 }} min={10}
                            step={0.01}
                            precision={2}
                            onChange={(value) => {
                                setMartinFixedMoney3(value)
                            }}
                        />
                        <InputNumber defaultValue={martinFixedMoney4} placeholder={martinFixedMoney4.toString()} style={{ width: 100 }} min={10}
                            step={0.01}
                            precision={2}
                            onChange={(value) => {
                                setMartinFixedMoney4(value)
                            }}
                        />
                    </FormItem>
                )}
                <Button
                    onClick={async () => {
                        const martin = { max_count: martinMaxCount, except_num: martinExceptNum, use_ratio: martinRatio, fixed: [martinFixedMoney1, martinFixedMoney2, martinFixedMoney3, martinFixedMoney4], ratio: martinRatioMoney }
                        const response = await SetMartin(martin)
                        if (response) {
                            if (response.ok) {
                                Notification.success({
                                    title: 'success',
                                    content: "马丁设置成功",
                                })
                            } else if (response.status !== 200 && response.status < 405) {
                                await logout()
                                navigate('/login')
                            } else {
                                var err = await response.json()
                                Notification.error({
                                    title: 'error',
                                    content: JSON.stringify(err),
                                })
                            }
                        }
                    }}
                    type='primary'
                >
                    提交
                </Button>
            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
            <Form
                autoComplete='off'
                size='mini'
                style={{ background: 'black', width: '100%' }}
                scrollToFirstError
                layout="inline"
            >
                <FormItem label='趋势按本金比例投入' field='use_ratio' >
                    <Switch checked={trendRatio} onChange={(value: boolean) => {
                        setTrendRatio(value)
                    }} />
                </FormItem>
                {trendRatio && (
                    <FormItem label='比例投入' field='invest_ratio' tooltip='实际投入usdt价值为账户合约总额*此比例值，注意杠杆'>

                        <InputNumber defaultValue={trendRatioInvest} placeholder={trendRatioInvest !== undefined ? trendRatioInvest.toString() : ''} style={{ width: 100 }} min={0.0001}
                            step={0.0001}
                            precision={4}
                            onChange={(value) => {
                                setTrendRatioInvest(value)
                            }}
                        />
                    </FormItem>
                )}

                {!trendRatio && (
                    <FormItem label='固定投入' field='invest_fixed' tooltip='实际投入usdt价值为此值'>

                        <InputNumber style={{ width: 100 }} min={10} defaultValue={trendFixedInvest} placeholder={trendRatioInvest !== undefined ? trendFixedInvest.toString() : ''}
                            step={0.01}
                            precision={2}
                            onChange={(value) => {
                                setTrendFixedInvest(value)
                            }}
                        />
                    </FormItem>
                )}
                <FormItem label='趋势tp值' field='trendTP' tooltip='设0为tv信号平仓，设:0.018为上涨或下跌1.8%平仓'>

                    <InputNumber style={{ width: 100 }} min={0} defaultValue={trendTP} placeholder={trendTP !== undefined ? trendTP.toString() : ''}
                        step={0.001}
                        precision={3}
                        onChange={(value) => {
                            setTrendTP(value)
                        }}
                    />
                </FormItem>
                <FormItem label='趋势sl值' field='trendSL' tooltip='设0为tv信号平仓，设:0.018为上涨或下跌1.8%平仓'>

                    <InputNumber style={{ width: 100 }} min={0} defaultValue={trendSL} placeholder={trendSL !== undefined ? trendSL.toString() : ''}
                        step={0.001}
                        precision={3}
                        onChange={(value) => {
                            setTrendSL(value)
                        }}
                    />
                </FormItem>
                <Button
                    onClick={async () => {

                        const response = await SetTrend(trendRatio, trendRatio ? trendRatioInvest : trendFixedInvest, trendTP, trendSL)
                        if (response) {
                            if (response.ok) {
                                Notification.success({
                                    title: 'success',
                                    content: "趋势设置成功",
                                })
                            } else if (response.status !== 200 && response.status < 405) {
                                await logout()
                                navigate('/login')
                            } else {
                                var err = await response.json()
                                Notification.error({
                                    title: 'error',
                                    content: JSON.stringify(err),
                                })
                            }
                        }
                    }}
                    type='primary'
                >
                    提交
                </Button>
            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }} />
            <Form
                autoComplete='off'
                size='mini'
                style={{ background: 'black', width: '100%' }}
                scrollToFirstError
                layout="inline"
            >
                <FormItem label='平仓盈利后转移一定比例资金到资金/现金账户' field='tranferprofit' >
                <InputNumber style={{ width: 100 }} min={0} max={1} defaultValue={profitTransfer} placeholder={profitTransfer !== undefined ? profitTransfer.toString() : ''}
                        step={0.01}
                        precision={2}
                        onChange={(value) => {
                            setProfitTransfer(value)
                        }}
                    />
                </FormItem>
                <Button
                    onClick={async () => {

                        const response = await SetProfitTrans(profitTransfer)
                        if (response) {
                            if (response.ok) {
                                Notification.success({
                                    title: 'success',
                                    content: "设置利润转移设置成功",
                                })
                            } else if (response.status !== 200 && response.status < 405) {
                                await logout()
                                navigate('/login')
                            } else {
                                var err = await response.json()
                                Notification.error({
                                    title: 'error',
                                    content: JSON.stringify(err),
                                })
                            }
                        }
                    }}
                    type='primary'
                >
                    提交
                </Button>
            </Form>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }} />
            <Button
                onClick={async () => {

                    await logout()
                    navigate('/login')
                }}
                type='primary'
            >
                登出
            </Button>
            <Divider
                style={{
                    borderBottomWidth: 2,
                    borderBottomStyle: 'dotted',
                }}
            />
        </div >
    );
};

export default SettingContent;