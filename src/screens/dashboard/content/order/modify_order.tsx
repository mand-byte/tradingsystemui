import { FC, useState } from 'react';
import { Modal, Form, Input, Select, Notification } from '@arco-design/web-react';
import { OrderInfo } from 'ObjectClass';
import { cancelOrder, logout, makeOrder } from 'api';
import { useNavigate } from 'react-router-dom';
const FormItem = Form.Item;
interface OrderInfoProps {
    order?: OrderInfo;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModifyOrder: FC<OrderInfoProps> = ({ order, visible, setVisible,refreshData }) => {

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    form.setFieldValue('price',order?.priceAvg)
    form.setFieldValue('posSide',order?.posSide)
    form.setFieldValue('sl',order?.sl)
    form.setFieldValue('tp',order?.tp)
    async function onOk() {
        var intput_money = form.getFieldValue("money")
        var intput_price = form.getFieldValue('price')
        var intput_sl = form.getFieldValue('sl')
        var intput_tp = form.getFieldValue('tp')
        var posSide = form.getFieldValue('posSide')
        var price = parseFloat(intput_price)
        var money = parseFloat(intput_money)
        var sl = parseFloat(intput_sl)
        var tp = parseFloat(intput_tp)

        if (isNaN(price) || isNaN(money) || isNaN(sl) || isNaN(tp)) {
            Notification.warning({
                title: 'Warning',
                content: '参数输入错误',
            })
            return
        }
        if (order?.isswap && posSide === "") {
            Notification.warning({
                title: 'Warning',
                content: '合约需指定多空',
            })
            return
        }
        if (sl === 0 && tp === 0) {
            Notification.warning({
                title: 'Warning',
                content: '止盈止损需设置一个',
            })
            return
        }
        setConfirmLoading(true);
        var response = await cancelOrder(order?.id || 0)
        if (response) {
            if (response.ok) {
                Notification.success({
                    title: 'success',
                    content: '订单删除成功，正在重新开仓',
                })
                var order_response = await makeOrder({ exid: order?.ex || 0, symbol: order?.symbol || '', money: money, isswap: order?.isswap || false, posSide: posSide==='long'?true:false, orderType: true, price: price, sl: sl, tp: tp,sltp_type:1 })
                if (order_response.ok) {
                    Notification.success({
                        title: 'success',
                        content: '重新开仓成功',
                    })
                    setConfirmLoading(false);
                    setVisible(false);
                } else {
                    var err = await order_response.json()
                    Notification.warning({
                        title: 'Warning',
                        content: JSON.stringify(err),
                    })
                    setConfirmLoading(false);
                    setVisible(false);
                }
            } else if (response.status !== 200 && response.status < 405) {
                await logout()
                navigate('/login')
                setConfirmLoading(false);
                setVisible(false);
            } else {
                err = await response.json()
                Notification.warning({
                    title: 'Warning',
                    content: JSON.stringify(err),
                })
                setConfirmLoading(false);
                setVisible(false);
            }
            refreshData(true)
        }


        // form.validate().then((res) => {
        //     setConfirmLoading(true);
        //     //   setTimeout(() => {
        //     //     Message.success('Success !');
        //     //     setVisible(false);
        //     //     setConfirmLoading(false);
        //     //   }, 1500);
        // });
    }

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    return (
        <div>
            <Modal
                title='修改订单'
                visible={visible}
                onOk={onOk}
                confirmLoading={confirmLoading}
                onCancel={() => setVisible(false)}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    labelCol={{
                        style: { flexBasis: 90 },
                    }}
                    wrapperCol={{
                        style: { flexBasis: 'calc(100% - 90px)' },
                    }}
                >
                    <FormItem label='投入金额' field='money' >
                        <Input placeholder='' />
                        {/* <Select options={['男', '女']} /> */}
                    </FormItem>
                    <FormItem label='开仓价格' field='price' >
                        <Input value={`${order?.priceAvg}`} />
                    </FormItem>
                    {
                        order?.isswap && <FormItem label='多空' field='posSide' >
                            <Select options={['long', 'short']} />
                        </FormItem>
                    }
                    <FormItem label='止损价' field='sl' >
                        <Input value={`${order?.sl}`} />
                    </FormItem>
                    <FormItem label='止盈价' field='tp' >
                        <Input value={`${order?.tp}`} />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
}

export default ModifyOrder;