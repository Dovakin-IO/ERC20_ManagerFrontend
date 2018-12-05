import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Modal, Progress } from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
import { exportXls } from '@/utils/helper';
import { stringify } from 'qs';
// import { DownloadModal } from '@/components/DownloadModal';
const FileSaver = require('file-saver');

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

  constructor() {
    super();
    this.state = {
      visible: false,
      percent: 0,
      filename: '用户数据',
    }
    this.startDownload = this.startDownload.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleOnProgress = this.handleOnProgress.bind(this);
  }

  handleOnLoad = (e) => {
    FileSaver.saveAs(e.target.response, this.state.filename);
    // setTimeout(() => waitingModal.destroy(), 400);
    setTimeout(() => {
      this.setState({
        visible: false,
      })
    },20000)
    router.push('/txadmin/export-step-form/result');
  }

  handleOnProgress = (evt) => {
    if (evt.lengthComputable) {
      let percentComplete = evt.loaded / evt.total;
      this.setState({
            percent: parseInt(percentComplete * 100),
      })
      // waitingModal.content.Progress.percent = percentComplete * 100
  }
  }
 
  startDownload = (address, filename) => {
    this.setState({
      visible: true,
      filename: filename,
    })
    let request = new XMLHttpRequest();
    request.open("GET", address, true);
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Authkey', sessionStorage.getItem("auth"));
    request.responseType="blob";
    request.onload=this.handleOnLoad;
    request.addEventListener("progress", this.handleOnProgress, false);
    request.send();
  }

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
                // exportXls(`/api/api/export/member?`+stringify({search:checkedValue}), values.filename + '.xlsx');
                // router.push('/txadmin/export-step-form/result');

                this.startDownload(`/api/api/export/member?`+stringify({search:checkedValue}), values.filename + '.xlsx')
            }
        });
        
    };
    return (
      <div>
        {/* <DownloadModal visible={false} /> */}
                <Modal
                    visible={this.state.visible}
                    title="正在生成数据表单，请耐心等待..."
                    footer={null}
                    >
                    <Progress percent={this.state.percent} />
                </Modal>
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
      </div>
    );
  }
}

export default Step2;
