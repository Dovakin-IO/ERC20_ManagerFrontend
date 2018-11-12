import React, { PureComponent } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Form, Row, Col, Input, Table, Button, DatePicker, Alert } from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";

import styles from "./TxSearchList.less";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ tx, loading }) => ({
  tx,
  loading: loading.models.tx
}))
@Form.create()
class TxSearchList extends PureComponent {
  state = {
    formValues: {}
  };

  columns = [
    {
      title: "交易hash",
      dataIndex: "txHash",
      width: 200,
      fixed: true,
      render: (text, record) => (
        <span>
          <a
            href="javascript:;"
            onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: "/tx/table-detail",
                  query: {
                    txHash: text
                  }
                })
              );
            }}
          >
            {text.substring(0, 6) + "..." + text.substring(60, 66)}
          </a>
        </span>
      )
      // 0x0a44d4537aeea0aec24ed337efe1c9782b0e01036864d3abd706e0b5c287f5dc
      // 0x33cba7065f61e8f66b98e83562a3a3998e31be97
    },
    {
      title: "客户姓名",
      dataIndex: "realName",
      width: 150
    },
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
      title: "手机号",
      dataIndex: "mobile",
      width: 200
    },
    {
      title: "块",
      dataIndex: "blockHeight",
      width: 150
    },
    {
      title: "交易时间",
      dataIndex: "timestamp",
      width: 150,
      render: (text, record) => {
        return this.fmtDate(text);
      }
    },
    {
      title: "转出地址",
      dataIndex: "tokenFrom",
      width: 150,
      render: (text, record) => (
        <span>
          {/* <a href="javascript:;"> */}
            {text.substring(0, 6) + "..." + text.substring(36, 42)}
          {/* </a> */}
        </span>
      )
    },
    {
      title: "转入地址",
      dataIndex: "tokenTo",
      width: 150,
      render: (text, record) => (
        <span>
          {/* <a href="javascript:;"> */}
            {text.substring(0, 6) + "..." + text.substring(36, 42)}
          {/* </a> */}
        </span>
      )
    },
    {
      title: "交易数量",
      dataIndex: "value",
      width: 200,
      render: (text, record) => (
        <span>{text.substring(0, text.length - 18) + "." + text.substring(text.length - 18, text.length-12)}</span>
      )
      // 11952000000000000000
    }
  ];

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //     type: 'tx/fetch',
    // });
  }

  handleChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: "tx/fetch",
      payload: {
        current: page.current,
        pageSize: page.pageSize,
        ...this.state.formValues,
        withdraw_task_id: localStorage.getItem('task_id'), 
      }
    });
  };

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
      let startTime = null;
      let endTime = null;
      if (values.timepicker != null && values.timepicker[0] != null) {
        startTime = values.timepicker[0].valueOf();
        endTime = values.timepicker[1].valueOf();
      }

      dispatch({
        type: "tx/fetch",
        payload: {
          ...values,
          current: 1,
          pageSize: 20,
          startTime: startTime,
          endTime: endTime,
          withdraw_task_id: localStorage.getItem('task_id'), 
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
      type: "tx/fetch",
      payload: {
        // option: 'to',
        // address: '0x5db605165d2e2212803c850b403030a021d045ef',
        // currentPage: 0,
        // pageSize: 5,
        current: 1,
        pageSize: 20,
        withdraw_task_id: localStorage.getItem('task_id'), 
      }
    });
  };

  fmtDate = obj => {
    let date = new Date(obj * 1000);
    let y = date.getFullYear();
    let m = "0" + (date.getMonth() + 1);
    let d = "0" + date.getDate();
    return (
      y +
      "-" +
      m.substring(m.length - 2, m.length) +
      "-" +
      d.substring(d.length - 2, d.length)
    );
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户编号">
              {getFieldDecorator("settlementAccountName")(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户姓名">
              {getFieldDecorator("realName")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator("mobile")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="转出地址">
              {getFieldDecorator("tokenFrom")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="转入地址">
              {getFieldDecorator("tokenTo")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="时间范围：">
              {getFieldDecorator("timepicker", rangeTimeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      tx: { data, pagination },
      loading,
      dispatch,
    } = this.props;
    return (
      <PageHeaderWrapper title="转账记录">
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
              bordered
              pagination={pagination}
              onChange={this.handleChange}
              columns={this.columns}
              scroll={{ x: 1500 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TxSearchList;
