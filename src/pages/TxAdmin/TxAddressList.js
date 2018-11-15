import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import cpctIcon from '../../assets/cpct_icon.png';

import styles from './TxAddressList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ txaddresslist, loading }) => ({
    txaddresslist,
    loading: loading.models.txaddresslist,
  }))
@Form.create()
class TxAddressList extends PureComponent {
    
    state = { visible: false, done: false };

    formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'txaddresslist/fetch',
          payload: {
          },
        });
    }

    showModal = () => {
        this.setState({
          visible: true,
          current: undefined,
        });
    };

    showEditModal = item => {
        this.setState({
          visible: true,
          current: item,
        });
    };

    handleDone = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
          done: false,
          visible: false,
        });
    };
    
    handleCancel = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
          visible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const { current } = this.state;
    
        setTimeout(() => this.addBtn.blur(), 0);
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.setState({
            done: true,
          });
        //   dispatch({
        //     type: 'list/submit',
        //     payload: { id, ...fieldsValue },
        //   });
        });
    };

    render() {
        const {
            txaddresslist: { list, info },
            loading,
        } = this.props;
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { visible, done, current = {} } = this.state;

        const modalFooter = done
        ? { footer: null, onCancel: this.handleDone }
        : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

        const Info = ({ title, value, bordered }) => (
            <div className={styles.headerInfo}>
              <span>{title}</span>
              <p>{value}</p>
              {bordered && <em />}
            </div>
        );

        const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
            <div className={styles.listContent}>
              <div className={styles.listContentItem}>
                <span>转账占比:</span>
              </div>
              {/* <div className={styles.listContentItem}>
                <span>开始时间</span>
                <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
              </div> */}
              <div className={styles.listContentItem}>
                <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
              </div>
            </div>
        );

        const getModalContent = () => {
            if (done) {
                return (
                  <Result
                    type="success"
                    title="操作成功"
                    description="一系列的信息描述，很短同样也可以带标点。"
                    actions={
                      <Button type="primary" onClick={this.handleDone}>
                        知道了
                      </Button>
                    }
                    className={styles.formResult}
                  />
                );
            }
            return (
                <Form onSubmit={this.handleSubmit}>
                <FormItem label="钱包地址" {...this.formLayout}>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入钱包地址' }],
                    // initialValue: current.title,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem {...this.formLayout} label="钱包别名">
                  {getFieldDecorator('subDescription', {
                    rules: [{ message: '请输入钱包地址的别名！', min: 1 }],
                    // initialValue: current.subDescription,
                  })(<TextArea rows={4} placeholder="请输入至少一个字符" />)}
                </FormItem>
              </Form>
            );
        }

        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title="地址数量" value={info.addressCount} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="总转出次数" value={info.transactionCount} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="总转出数量" value={info.transactionValue} />
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="平台地址列表"
                        style={{ marginTop: 24 }}
                        bodyStyle={{ padding: '0 32px 40px 32px' }}
                        >
                            <Button
                                type="dashed"
                                style={{ width: '100%', marginBottom: 8 }}
                                icon="plus"
                                onClick={this.showModal}
                                ref={component => {
                                    /* eslint-disable */
                                    this.addBtn = findDOMNode(component);
                                    /* eslint-enable */
                                }}
                                >
                                添加
                            </Button>
                            <List
                                size="large"
                                rowKey="id"
                                loading={loading}
                                dataSource={list}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <a
                                            onClick={e => {
                                                e.preventDefault();
                                                this.showEditModal(item);
                                            }}
                                            >
                                            编辑
                                            </a>,
                                            // <MoreBtn current={item} />,
                                        ]}
                                        >
                                        <List.Item.Meta
                                            avatar={<Avatar src={cpctIcon} shape="square" size="large" />}
                                            title={<a href={item.href}>{item.title}</a>}
                                            description={item.address}
                                        />
                                        <ListContent data={item} />
                                    </List.Item>
                                )}
                                />
                    </Card>
                
                </div>
                <Modal
                    title={done ? null : `地址${current ? '编辑' : '添加'}`}
                    className={styles.standardListForm}
                    width={640}
                    bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
                    destroyOnClose
                    visible={visible}
                    {...modalFooter}
                    >
                    {getModalContent()}
                </Modal>
            </PageHeaderWrapper>
        );
    }
  }
  
  export default TxAddressList;