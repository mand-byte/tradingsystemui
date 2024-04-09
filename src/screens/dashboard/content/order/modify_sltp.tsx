import { FC, useState } from 'react';
import { Modal, Form, Notification, InputNumber } from '@arco-design/web-react';
import { OrderInfo,ModifySLTPRequest } from 'ObjectClass';
import {  modifySLTP } from 'api';
const FormItem = Form.Item;
interface ModifySLTPProps {
    order?: OrderInfo;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModifySLTP: FC<ModifySLTPProps> = ({ order, visible, setVisible, refreshData }) => {

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    form.setFieldValue('sl',order?.sl)
    form.setFieldValue('tp',order?.tp)
    async function onOk() {

        var intput_sl = form.getFieldValue('sl')
        var intput_tp = form.getFieldValue('tp')

        var sl = parseFloat(intput_sl)
        var tp = parseFloat(intput_tp)

        if (isNaN(sl) || isNaN(tp)) {
            Notification.warning({
                title: 'Warning',
                content: '参数输入错误',
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
        var request:ModifySLTPRequest={sl:sl,tp:tp};
        if (order?.id===0){
            request.id=0
            request.symbol=order.symbol||''
            request.isswap=order.isswap||true
            request.posSide=order?.posSide==='long' ?true :false
            request.exid=order.ex
        }else{
            request.id=order?.id
            request.isswap=order?.isswap
            request.posSide=order?.posSide==='long' ?true :false
            request.symbol=''
            request.exid=order?.ex
        }
        var response = await modifySLTP(request)
        if (response) {
            if (response.ok) {
                Notification.success({
                    title: 'success',
                    content: "止盈止损修改成功",
                })
            }
            else {
                var result = await response.json()
                Notification.error({
                    title: 'error',
                    content: JSON.stringify(result),
                })
            }
            setConfirmLoading(false);
            setVisible(false);
            refreshData(true)
        }


        
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
                title='修改止盈止损'
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
                  
                    <FormItem label='止损价' field='sl' >
                        <InputNumber min={0}/>
                    </FormItem>
                    <FormItem label='止盈价' field='tp' >
                        <InputNumber min={0}/>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
}

export default ModifySLTP;