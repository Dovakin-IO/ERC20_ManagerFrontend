import React from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import {
  Row,
  Col,
  Card,
  Tabs,
  Table,
  Alert
} from 'antd';
import DataSet from "@antv/data-set";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const TabPane = Tabs.TabPane;

@connect(({ txexceptiontransaction, loading }) => ({
  txexceptiontransaction,
  loading: loading.models.txexceptiontransaction
}))
class TxExceptionTransaction extends React.Component {

  componentWillMount() {
    this.props.dispatch({
        type: "txexceptiontransaction/fetchLess",
        payload: {
          taskId: sessionStorage.getItem('task_id'),
          current: 1,
          pageSize: 20, 
          isless: 0,
          total: sessionStorage.getItem("transferCount"),
        }
    });
    this.props.dispatch({
      type: "txexceptiontransaction/fetchMore",
      payload: {
        taskId: sessionStorage.getItem('task_id'),
        current: 1,
        pageSize: 20,
        isless: 1,
        total: sessionStorage.getItem("transferCount"),
      }
    });
  }

  handleLessChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: "txexceptiontransaction/fetchLess",
      payload: {
        taskId: sessionStorage.getItem('task_id'),
        current: page.current,
        pageSize: page.pageSize,
        isless: 0,
        total: sessionStorage.getItem("transferCount"),
      }
    });
  };

  handleMoreChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: "txexceptiontransaction/fetchMore",
      payload: {
        taskId: sessionStorage.getItem('task_id'),
        current: page.current,
        pageSize: page.pageSize,
        isless: 1,
        total: sessionStorage.getItem("transferCount"),
      }
    });
  };

  columns = [
    {
        title: "序号",
        width:50,
        render: (text, record, index) => {
          return(
            <span><strong>{index+1}</strong></span>
         )
        }
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
        title: "姓名",
        dataIndex: "realName",
        width: 150
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      width: 150
    },
    {
      title: "转账次数",
      dataIndex: "total",
      key: "total",
      width: 150
    },
    {
      title: "异常次数",
      dataIndex: "total",
      key: "total_ex",
      width: 150,
      render: (text, record) => {
        return (
          text - sessionStorage.getItem("transferCount") < 0 ?
          <span style={{color:"red"}}>  
            <strong>
              {Math.abs(text - sessionStorage.getItem("transferCount"))}
            </strong>       
          </span>
          :
          <span style={{color:"green"}}>
            <strong>
              {Math.abs(text - sessionStorage.getItem("transferCount"))}
            </strong>
          </span>
        )
      }
    }

];

  render() {
    const {
      txexceptiontransaction: { dataless, datamore, paginationless, paginationmore, memberCount },
      loading,
      dispatch,
    } = this.props;
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: "正常比例",
        count: 33527 - paginationless.total - paginationmore.total,
      },
      {
        item: "少转比例",
        count: paginationless.total,
      },
      {
        item: "多转比例",
        count: paginationmore.total,
      },
    ];
    const bl_data = [
      {
        type: "少转会员",
        人数: paginationless.total
      },
      {
        type: "多转会员",
        人数: paginationmore.total
      },
      {
        type: "正常会员",
        人数: memberCount - paginationless.total - paginationmore.total,
      },

    ];
    const dv = new DataView();
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 },
    };
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    const bl_cols = {
      人数: {
        tickInterval: memberCount
      }
    };
    return (
      <PageHeaderWrapper title="转账异常统计">
        <GridContent>
          <Row gutter={24}>
            <Col 
            {...topColResponsiveProps}
            >
            <Card
              title="图表展示"
              style={{ height: 500, marginBottom: 24  }}
              >
              <div>
                <Chart
                  height={500}
                  data={dv}
                  scale={cols}
                  padding={[1, 100, 80, 1]}
                  
                  >
                  <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Legend
                    position="right"
                    offsetY={-500 / 2 + 20}
                    offsetX={-5}
                    textStyle={{
                      textAlign: 'start', // 文本对齐方向，可取值为： start middle end
                      fill: '#404040', // 文本的颜色
                      fontSize: '16', // 文本大小
                      fontWeight: 'bold', // 文本粗细
                      textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
                    }}
                  />
                  <Tooltip
                    showTitle={false}
                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Guide>
                    <Html
                      position={["50%", "50%"]}
                      html={"<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>会员<br><span style=&quot;color:#262626;font-size:2.5em&quot;>" + memberCount +"</span>人</div>"}
                      alignX="middle"
                      alignY="middle"
                    />
                  </Guide>
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color="item"
                    tooltip={[
                      "item*percent",
                      (item, percent) => {
                        percent = percent * 100 + "%";
                        return {
                          name: item,
                          value: percent
                        };
                      }
                    ]}
                    style={{
                      lineWidth: 1,
                      stroke: "#fff"
                    }}
                  >
                    {/* <Label
                      content="percent"
                      formatter={(val, item) => {
                        return item.point.item + ": " + val;
                      }}
                    /> */}
                    </Geom>
                  </Chart>
                </div>
              </Card>

            </Col>
            <Col 
              {...topColResponsiveProps}
              >
              <Card
                title="比例统计"
                style={{ height: 500, marginBottom: 24  }}
                >
                <div>
                  <Chart height={400} data={bl_data} scale={bl_cols} forceFit>
                    <Axis name="type" />
                    <Axis name="人数" />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom type="interval" position="type*人数" />
                  </Chart>
                </div>
              
              </Card>
            </Col>
          </Row>
        </GridContent>
        
        <Alert style={{ marginBottom: 10 }} 
                message={
                  "目前平台转账次序为 " + sessionStorage.getItem("transferCount") + " 次， 异常次数统计列中，红色代表少转次数，绿色表示多转次数"} 
                type="info" 
                showIcon
                />
        <Card
          title="">

          <Tabs>
            <TabPane tab="少转用户" key="1">
                <Table 
                  loading={loading}
                  dataSource={dataless}
                  bordered
                  pagination={paginationless}
                  onChange={this.handleLessChange}
                  columns={this.columns}
                  />
            </TabPane>
            <TabPane tab="多转用户" key="2">
              <Table 
                  loading={loading}
                  dataSource={datamore}
                  bordered
                  pagination={paginationmore}
                  onChange={this.handleMoreChange}
                  columns={this.columns}
                  />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TxExceptionTransaction;


  
  