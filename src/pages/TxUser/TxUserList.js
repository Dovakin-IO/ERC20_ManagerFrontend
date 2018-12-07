import React, { PureComponent } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Form, Row, Col, Input, Table, Button, DatePicker, Alert, Tag, Select } from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";
import { message } from 'antd';

import styles from "./TxUserList.less";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ txuserlist, loading }) => ({
    txuserlist,
    loading: loading.models.txuserlist
}))
@Form.create()
class TxUserList extends PureComponent {
    state = {
        formValues: {}
    };

    componentWillMount() {
        this.props.dispatch({
            type: "txuserlist/fetch",
            payload: {
              current: 1,
              pageSize: 20,
              withdraw_task_id: sessionStorage.getItem('task_id'), 
            }
        });
    }

    columns = [
        {
            title: "客户编号",
            dataIndex: "settlementAccountName",
            width: 150,
            render: (text, record) => (
                <span>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this.props.dispatch(
                        routerRedux.push({
                          pathname: "/txuser/user_detail",
                          query: {
                            settlement_account_name: text
                          }
                        })
                      );
                    }}
                  >
                    {text}
                  </a>
                </span>
            )
        },
        {
            title: "姓名",
            dataIndex: "realName",
            width: 150
        },
        {
            title: "手机号",
            dataIndex: "mobile",
            width: 200
        },
        {
            title: "地区",
            dataIndex: "areaName",
            width: 150
        },
        {
            title: "操作",
            key: "action",
            width: 150,
            render: (text, record) => (
                <span>
                    <a href="javascript:;"                     
                      onClick={() => {
                        if(sessionStorage.getItem("role") === 'onlysearch'){
                            message.error("您当前没有修改权限！");
                            return;
                        }
                        this.props.dispatch(
                            routerRedux.push({
                            pathname: "/txuser/user_edit",
                            query: {
                                id: record.id,
                            }
                            })
                        );
                    }}>修改</a>
                </span>
            )
        }
    ];

    handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue
          };
    
          this.setState({
            formValues: values
          });
          dispatch({
            type: "txuserlist/fetch",
            payload: {
              settlementAccountName: values.settlementAccountName === ''? null : values.settlementAccountName,
              realName: values.realName === ''? null : values.realName,
              mobile: values.mobile === ''? null : values.mobile,
              accountPrefix: values.accountPrefix,
              namePrefix: values.namePrefix, 
              current: 1,
              pageSize: 20,
              withdraw_task_id: sessionStorage.getItem('task_id'), 
            }
            });
        });


    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {}
        });
        dispatch({
          type: "txuserlist/fetch",
          payload: {
            current: 1,
            pageSize: 20,
            withdraw_task_id: sessionStorage.getItem('task_id'), 
          }
        });
      };

    handleChange = page => {
        const { dispatch } = this.props;
        dispatch({
            type: "txuserlist/fetch",
            payload: {
              current: page.current,
              pageSize: page.pageSize,
              ...this.state.formValues,
              withdraw_task_id: sessionStorage.getItem('task_id'), 
            }
        });
    };

    renderForm() {
        const {
            form: { getFieldDecorator }
        } = this.props;
      
        const formItemLayout = {
            labalCol: {
              xs: { span: 24 },
              sm: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
        };
        const rangeTimeConfig = {
            rules: [{ type: "array" }]
        };

        const preAccountfixSelector = getFieldDecorator('accountPrefix', {
            initialValue: '0',
        })(
            <Select style={{ width: 100 }}>
              <Option value="0">模糊查询</Option>
              <Option value="1">精确查询</Option>
            </Select>
        );
      
        const preNamefixSelector = getFieldDecorator('namePrefix', {
            initialValue: '0',
        })(
            <Select style={{ width: 100 }}>
              <Option value="0">模糊查询</Option>
              <Option value="1">精确查询</Option>
            </Select>
        );

        return (
            <Form onSubmit={this.handleSearch} layout="inline" >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="客户编号">
                        {getFieldDecorator("settlementAccountName")(
                            <Input addonAfter={preAccountfixSelector} placeholder="请输入" />
                        )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="客户姓名">
                        {getFieldDecorator("realName")(<Input addonAfter={preNamefixSelector} placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="手机号">
                        {getFieldDecorator("mobile")(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: "hidden" }}>
                    <div style={{ float: "right", marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }
    
    render () {
        const {
            txuserlist: { data, pagination },
            loading,
            dispatch,
        } = this.props;
        return (
            <PageHeaderWrapper title="用户管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <Alert style={{ marginBottom: 10 }} 
                            message={
                            typeof(pagination.total) == "undefined"?
                            "查询结果总计: 0 条"
                            : "查询结果总计: " + pagination.total
                            + " 条"} 
                            type="info" 
                            showIcon
                            />
                        <Table
                            loading={loading}
                            dataSource={data}
                            pagination={pagination}
                            onChange={this.handleChange}
                            columns={this.columns}
                            />
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }
}

export default TxUserList;