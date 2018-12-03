import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
import { exportXls } from '@/utils/helper';
import { stringify } from 'qs';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ txexport, loading }) => ({
  submitting: loading.effects['txexport/submitStepForm'],
  data: txexport.step,
  checkedValue: txexport.checkedValue,
}))
@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, data, dispatch, submitting, checkedValue } = this.props;
    
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push('/txadmin/export-step-form/info');
    };
    const onValidateForm = e => {
        
        e.preventDefault();
        validateFields((err, values) => {
            if (!err) {
            // dispatch({
            //     type: 'txexport/submitStepForm',
            //     payload: {
            //     ...data,
            //     ...values,
            //     },
            // });
                exportXls(`/api/api/export/member?`+stringify({search:checkedValue}), values.filename + '.xlsx');
                router.push('/txadmin/export-step-form/result');
            }
        });
        
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="如不修改文件名，则使用默认文件名<用户数据>"
          style={{ marginBottom: 24 }}
        />
        {/* <Form.Item {...formItemLayout} className={styles.stepFormText} label="付款账户">
          {data.payAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款账户">
          {data.receiverAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款人姓名">
          {data.receiverName}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="转账金额">
          <span className={styles.money}>{data.amount}</span>
          <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span>
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} /> */}
        <Form.Item {...formItemLayout} label="文件名" required={false}>
          {getFieldDecorator('filename', {
            initialValue: '用户数据',
            rules: [
              {
                required: true,
                message: '请输入文件名',
              },
            ],
          })(<Input autoComplete="off" style={{ width: '80%' }} />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            导出数据
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;
