import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Checkbox, Row, Col, } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;





const options = [
    { label: '闽东', value: '1' },
    { label: '华东', value: '2' },
    { label: '云贵', value: '3' },
    { label: '川渝', value: '4' },
    { label: '闵浙', value: '5' },
    { label: '互生', value: '6' },
    { label: '江北凯里', value: '7' },
];

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ txexport }) => ({
  data: txexport.step,
}))
@Form.create()
class Step1 extends React.PureComponent {


  constructor() {
      super();
      this.state = {
        checkedValue: '',
      }
      this.onChange = this.onChange.bind(this);
      this.onNext = this.onNext.bind(this);
  }

  onNext() {
    const { dispatch } = this.props;
    dispatch({
        type: 'txexport/saveStepFormData',
        payload: {
            checkedValue: this.state.checkedValue,
        },
    });
    router.push('/txadmin/export-step-form/confirm');
  };

  onChange(checkedValues) {
    console.log('checked = ', checkedValues);
    let value = '';
    for(let i = 0; i < checkedValues.length; i++) {
        value += checkedValues[i];
        if(i != checkedValues.length - 1) {
            value += ",";
        }
    }
    this.setState({
        checkedValue: value,
    });
    console.log('checkedValue = ', value);
  }

  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'txexport/saveStepFormData',
            payload: values,
          });
          router.push('/txadmin/export-step-form/confirm');
        }
      });
    };
    return (
      <Fragment>
          <br></br>
          <br></br>
          <Row>
            <Col span={9}></Col>
            <Col span={9}>
                <CheckboxGroup options={options} onChange={this.onChange} />
            </Col>
            <Col span={9}></Col>
          </Row>
          <br></br>
          <br></br>
          <Row>
            <Col span={9}></Col>
            <Col span={9}>
                <Button type="primary" onClick={this.onNext}>
                    下一步
                </Button>
            </Col>
            <Col span={9}></Col>
          </Row>

        
        {/* <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="付款账户">
            {getFieldDecorator('payAccount', {
              initialValue: data.payAccount,
              rules: [{ required: true, message: '请选择付款账户' }],
            })(
              <Select placeholder="test@example.com">
                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收款账户">
            <Input.Group compact>
              <Select defaultValue="alipay" style={{ width: 100 }}>
                <Option value="alipay">支付宝</Option>
                <Option value="bank">银行账户</Option>
              </Select>
              {getFieldDecorator('receiverAccount', {
                initialValue: data.receiverAccount,
                rules: [
                  { required: true, message: '请输入收款人账户' },
                  { type: 'email', message: '账户名应为邮箱格式' },
                ],
              })(<Input style={{ width: 'calc(100% - 100px)' }} placeholder="test@example.com" />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="收款人姓名">
            {getFieldDecorator('receiverName', {
              initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入收款人姓名' }],
            })(<Input placeholder="请输入收款人姓名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="转账金额">
            {getFieldDecorator('amount', {
              initialValue: data.amount,
              rules: [
                { required: true, message: '请输入转账金额' },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法金额数字',
                },
              ],
            })(<Input prefix="￥" placeholder="请输入金额" />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form> */}

        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>选择大区</h4>
          <p>
            勾选您想要导出的大区选项，导出的文件会包含您所选大区的所有数据
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
