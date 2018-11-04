import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Button,
    Menu,
    Dropdown,
    Icon,
    Row,
    Col,
    Steps,
    Card,
    Popover,
    Badge,
    Table,
    Tooltip,
    Divider,
} from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TxUserDetail.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const Search = Input.Search;
const FormItem = Form.Item;

const dateFormat = (datestr) => {
    if (datestr == null) return "";
    let date = datestr.substring(0,10);
    let time = datestr.substring(11,19);
    return date + " " + time;
}

const extra = (user) => (
    <Row>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>已转账次数(CPCT)</div>
        <div className={styles.heading}>{user.transferTotal}</div>
      </Col>
    </Row>
);

const columns = [
    {
        title: '钱包地址',
        dataIndex: 'cpct_address',
        key: 'cpct_address',
    },
    {
        title: '添加时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: text => {
            return dateFormat(text);
        }
    },
    {
        title: '状态',
        dataIndex: 'is_main',
        key: 'is_main',
        render: text =>
          text === '1' ? (
            <Badge status="success" text="启用" />
          ) : (
            <Badge status="error" text="停用" />
          ),
    },
    {
        title: '转出次数',
        dataIndex: 'transfer_from_count',
        key: 'transfer_from_count',
    },
    {
        title: '转入次数',
        dataIndex: 'transfer_to_count',
        key: 'transfer_to_count',
    },
]


@connect(({txuser, loading}) => ({
    txuser,
    loading: loading.models.txuser,
}))
@Form.create()
class TxUserDetail extends Component {

    state = {
        isModifyAddress: true,
        cpct_address: '',
    }

    description = (user) => (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="用户姓名">{user.name}</Description>
          <Description term="手机号">{user.mobile}</Description>
          <Description term="创建时间">{dateFormat(user.create_time)}</Description>
          <Description term="订单编号">{user.order_id}</Description>
          <Description term="提币地址">
            <a href="">{user.cpct_address + " "}</a>
            <Button type="danger" size="small" ghost onClick={this.toggle}>修改地址</Button>
          </Description>
        </DescriptionList>
    );

    componentDidMount() {
        const { location, dispatch } = this.props;
        dispatch({
          type: 'txuser/fetch',
          payload: {
            settlement_account_name: location.query.settlement_account_name,
          }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isModifyAddress: nextProps.txuser.isModifyAddress,
        })
    }

    // componentWillUpdate() {
    //     // const { txuser, dispatch } = this.props;
    //     // const { user } = txuser;
    //     // dispatch({
    //     //     type: 'txuser/fetch',
    //     //     payload: {
    //     //         settlement_account_name: user.settlement_account_name,
    //     //     }
    //     // })
    // }

    toggle = () => {
        const { isModifyAddress } = this.state;
        this.setState({
            isModifyAddress: false,
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { txuser, dispatch } = this.props;
        const { user } = txuser;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
    
            const values = {
                ...fieldsValue,
            }
            
            dispatch({
                type: 'txuser/addAddress',
                payload: {
                    settlement_account_name: user.settlement_account_name,
                    cpct_address: values.modify_address,
                }
            })
    
        });
    }

    onCancel = () => {
        const { isModifyAddress } = this.state;
        this.setState({
            isModifyAddress: true,
        })
    }

    render() {
        const { loading , txuser, dispatch, form: { getFieldDecorator }, } = this.props;
        const { isModifyAddress } = this.state;
        const { user, list } = txuser;
        const action = (
    
            <Fragment>
                <Search 
                    placeholder="输入用户编号查询"
                    style={{ width: 200, marginRight: 10}}
                    onSearch={ value => {
                        dispatch({
                            type: 'txuser/fetch',
                            payload: {
                              settlement_account_name: value,
                            }
                          });
                    }}
                    />
              <Button type="primary">编辑</Button>
            </Fragment>
        );
        return (
            <PageHeaderWrapper
                title={"用户编号：" + user.settlement_account_name}
                logo={
                <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
                }
                action={action}
                content={this.description(user)}
                extraContent={extra(user)}
                >
                <Card
                    style={{ marginBottom: 24 }}
                    title="修改钱包地址"
                    hidden={isModifyAddress}
                    >
                    <Row gutter={{ md: 8, lg: 24, xl: 48}}>
                        <Form layout="inline" >
                            <FormItem>
                                {getFieldDecorator('modify_address', {
                                    rules: [{required: true, message: '请输入地址！'}],
                                })(
                                    <Input style={{ fontSize: 13, width: 500}} />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button 
                                    type="primary"
                                    onClick={this.onSubmit}
                                    >
                                    修改
                                </Button>
                                <Button 
                                    style={{ marginLeft: 20 }}
                                    onClick={this.onCancel}
                                    >
                                    取消
                                </Button>
                            </FormItem>
                        </Form>
                    </Row>
                </Card>
                <Card
                    title="用户地址记录"
                    className={styles.tabsCard}
                    >
                    <Table 
                        pagination={false}
                        loading={loading}
                        columns={columns}
                        dataSource={list}
                        />
                </Card>
            </PageHeaderWrapper>
        );
    }
  }

export default TxUserDetail;