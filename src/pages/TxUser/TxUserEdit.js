import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from "dva/router";
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TxUserEdit.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({txuseredit,  loading }) => ({
    txuseredit,
    submitting: loading.effects['txuseredit/submitRegularForm'],
}))
@Form.create()
class TxUserEdit extends PureComponent {

    componentDidMount() {
        const { location, dispatch } = this.props;
        dispatch({
          type: "txuseredit/fetch",
          payload: {
            id: location.query.id,
          }
        });
    }

    handleSubmit = e => {
        const { dispatch, form, txuseredit: { user }} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            dispatch({
              type: 'txuseredit/submitRegularForm',
              payload: {
                ...values,
                withdraw_task_id: user.withdraw_task_id,
                
              },
            });
          }
        });
    };

    render() {
        const { submitting, txuseredit: { user }, dispatch } = this.props;
        const {
          form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 10 },
            },
        };
      
        const submitFormLayout = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 10, offset: 7 },
            },
        };
        return (
            <PageHeaderWrapper
                title={<FormattedMessage id="app.tx.txuseredit.title" />}
                content={<FormattedMessage id="app.tx.txuseredit.description" />}
                >
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="用户ID" />}>
                            {getFieldDecorator('id', {
                                initialValue: user.id,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                disabled={true}
                                style={{ width: 300 }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="用户编号" />}>
                            {getFieldDecorator('settlementAccountName', {
                                initialValue: user.settlementAccountName,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 300 }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="姓名" />}>
                            {getFieldDecorator('realName', {
                                initialValue: user.realName,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 300 }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="手机号" />}>
                            {getFieldDecorator('mobile', {
                                initialValue: user.mobile,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 300 }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="邮箱" />}>
                            {getFieldDecorator('email', {
                                initialValue: user.email,
                                rules: [
                                {
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '请输入邮箱地址' })} 
                                style={{ width: 300 }}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="钱包地址" />}
                                label={
                                    <span>
                                        <FormattedMessage id="钱包地址" />
                                            <em className={styles.optional}>
                                                <FormattedMessage id="（ 激活 ）" />
                                                <Tooltip title={<FormattedMessage id="当前显示的为激活状态的钱包地址" />}>
                                                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                                                </Tooltip>
                                            </em>
                                    </span>
                                }
                            >
                            {getFieldDecorator('cpctAddress', {
                                initialValue: user.cpctAddress,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 500 }}
                                disabled={true}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="订单编号" />}>
                            {getFieldDecorator('orderId', {
                                initialValue: user.orderId,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 300 }}
                                disabled={true}
                                />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={<FormattedMessage id="地区" />}>
                            {getFieldDecorator('areaName', {
                                initialValue: user.areaName,
                                rules: [
                                {
                                    required: true,
                                    message: formatMessage({ id: 'validation.title.required' }),
                                },
                                ],
                            })(<Input placeholder={formatMessage({ id: '该字段不能为空' })} 
                                style={{ width: 300 }}
                                disabled={true}
                                />)}
                        </FormItem>
                    </Form>
                    <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
                            <FormattedMessage id="form.update" />
                        </Button>
                        <Button style={{ marginLeft: 8 }}
                            onClick={() => {
                                dispatch(
                                    routerRedux.push({
                                      pathname: "/txuser/user_list",
                                      query: {
                                      }
                                    })
                                );
                            }}
                            >
                            <FormattedMessage id="form.back" />
                        </Button>
                    </FormItem>
                </Card>
            </PageHeaderWrapper>
        )
    }
}

export default TxUserEdit;