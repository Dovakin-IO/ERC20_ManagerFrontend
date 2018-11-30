import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Avatar,
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip as Tip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import Websocket from 'react-websocket';
import DataSet from "@antv/data-set";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
    test: '',
    currentBlock: undefined,
    checkedBlockHeight: undefined,
    header: {
      transferValue: '',
      transferCount: '',
      gasused: '',
    },
    analysisData: [
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
      {
        "平台转入": 0,
        "非平台转入": 0,
        "会员账户转出": 0
      },
    ],
    transactionData: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({
      loading: false,

    });
    // this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'chart/fetch',
    //   });
    //   this.timeoutId = setTimeout(() => {
    //     this.setState({
    //       loading: false,
    //     });
    //   }, 600);
    // });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleData(data) {
    let result = JSON.parse(data);
    this.setState({
      currentBlock: result.currentBlockHeight,
      checkedBlockHeight: result.checkedBlockHeight,
      header: result.header,
      analysisData: result.dataAnalyses? result.dataAnalyses : this.state.analysisData,
      transactionData: result.analyses? result.analyses : this.state.transactionData,
    });
  }

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {
    const { DataView } = DataSet;
    const { rangePickerValue, salesType, loading: propsLoding, currentTabKey, 
      test, currentBlock, checkedBlockHeight, header, analysisData, transactionData } = this.state;
    const { chart, loading: stateLoading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const loading = propsLoding || stateLoading;

    // const transactionData = [
    //   {
    //     block: 6600000,
    //     CPCT交易记录数量: 3,
    //   },
    //   {
    //     block: 6600001,
    //     CPCT交易记录数量: 4,
    //   },
    //   {
    //     block: 6600002,
    //     CPCT交易记录数量: 1,
    //   },
    //   {
    //     block: 6600003,
    //     CPCT交易记录数量: 0,
    //   },
    //   {
    //     block: 6600004,
    //     CPCT交易记录数量: 6,
    //   },
    //   {
    //     block: 6600005,
    //     CPCT交易记录数量: 5,
    //   },
    //   {
    //     block: 6600006,
    //     CPCT交易记录数量: 12,
    //   },
    //   {
    //     block: 6600007,
    //     CPCT交易记录数量: 0,
    //   },
    //   {
    //     block: 6600008,
    //     CPCT交易记录数量: 2,
    //   },
    //   {
    //     block: 6600010,
    //     CPCT交易记录数量: 15,
    //   },
    //   {
    //     block: 6600009,
    //     CPCT交易记录数量: 1,
    //   },

    // ];

    const cols = {
      交易记录数量: {
        min: 0
      },
      block: {
        range: [0, 0.9]
      }
    };

    const data = [
      {
        group: "闽东",
        type: "闽东",
        "平台转入": analysisData[0].平台转入,
        "非平台转入": analysisData[0].非平台转入,
        "会员账户转出": analysisData[0].会员账户转出
      },
      {
        group: "华东",
        type: "华东",
        "平台转入": analysisData[1].平台转入,
        "非平台转入": analysisData[1].非平台转入,
        "会员账户转出": analysisData[1].会员账户转出
      },
      {
        group: "云贵",
        type: "云贵",
        "平台转入": analysisData[2].平台转入,
        "非平台转入": analysisData[2].非平台转入,
        "会员账户转出": analysisData[2].会员账户转出
      },
      {
        group: "川渝",
        type: "川渝",
        "平台转入": analysisData[3].平台转入,
        "非平台转入": analysisData[3].非平台转入,
        "会员账户转出": analysisData[3].会员账户转出
      },
      {
        group: "闵浙",
        type: "闵浙",
        "平台转入": analysisData[4].平台转入,
        "非平台转入": analysisData[4].非平台转入,
        "会员账户转出": analysisData[4].会员账户转出
      },
      {
        group: "互生",
        type: "互生",
        "平台转入": analysisData[5].平台转入,
        "非平台转入": analysisData[5].非平台转入,
        "会员账户转出": analysisData[5].会员账户转出
      },
      {
        group: "江北凯里",
        type: "江北凯里",
        "平台转入": analysisData[6].平台转入,
        "非平台转入": analysisData[6].非平台转入,
        "会员账户转出": analysisData[6].会员账户转出
      },
    ];
    const dv = new DataView();
    dv.source(data)
      .transform({
        type: "map",

        callback(row) {
          row["会员账户转出"] *= -1;
          return row;
        }
      })
      .transform({
        type: "fold",
        fields: [
          "会员账户转出",
          "非平台转入",
          "平台转入"
        ],
        key: "opinion",
        value: "value",
        retains: ["group", "type"]
      });
    const colorMap = {
      "平台转入": "#3561A7",
      // Agree: "#80B2D3",
      "非平台转入": "#D9F0F6",
      // Disagree: "#EC7743",
      "会员账户转出": "#CB2920"
    };


    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: <FormattedMessage id="app.analysis.table.rank" defaultMessage="Rank" />,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: (
          <FormattedMessage
            id="app.analysis.table.search-keyword"
            defaultMessage="Search keyword"
          />
        ),
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: <FormattedMessage id="app.analysis.table.users" defaultMessage="Users" />,
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: (
          <FormattedMessage id="app.analysis.table.weekly-range" defaultMessage="Weekly Range" />
        ),
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    const pageHeaderContent =
    (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          {/* <Avatar size="large" src={currentUser.avatar} /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            {/* 早安，
            ，祝你开心每一天！ */}
          </div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>已转账金额(CPCT)</p>
          <p>{header.transferValue}</p>
        </div>
        <div className={styles.statItem}>
          <p>转账进度（次）</p>
          <p>
            {header.transferCount}<span> / 100</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>总矿工费消耗（ETH）</p>
          <p>{header.gasused}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={loading}
        content={pageHeaderContent}
        extraContent={extraContent}
        >
        <GridContent>
          <Row gutter={24}>
          <div>
              <Websocket 
                url='ws://47.244.9.96/ws/monitor'
                // url='ws://127.0.0.1:8080/monitor'
                onMessage={this.handleData.bind(this)}/>
          </div>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                loading={loading}
                title={<FormattedMessage id="app.analysis.payments" defaultMessage="Payments" />}
                action={
                  <Tooltip
                    title={
                      <FormattedMessage id="app.analysis.blocksync" defaultMessage="Introduce" />
                    }
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
              
                total={
                  currentBlock ?
                  numeral(currentBlock).format('0,0')
                  : "正在获取"
                }
                footer={
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  </div>
                }
                contentHeight={46}
              >
                <MiniProgress percent={78} strokeWidth={8} target={80} color="#f50" />
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                loading={loading}
                bordered={false}
                title={
                  <FormattedMessage
                    id="app.analysis.operational-effect"
                    defaultMessage="Operational Effect"
                  />
                }
                action={
                  <Tooltip
                    title={
                      <FormattedMessage id="app.analysis.blockcheck" defaultMessage="introduce" />
                    }
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={
                  checkedBlockHeight ?
                  numeral(checkedBlockHeight).format('0,0')
                  : "正在获取"
                }
                footer={
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  </div>
                }
                contentHeight={46}
              >
                <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
              </ChartCard>
            </Col>
          </Row>

          <Row gutter={24}>      
              <Col span={12}>
                <Card
                  >
                  <Chart height={400} data={transactionData} scale={cols} forceFit>
                    <Axis name="block" />
                    <Axis name="交易记录数量" />
                    <Tip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom type="line" position="block*交易记录数量" size={2} />
                    <Geom
                      type="point"
                      position="block*交易记录数量"
                      size={5}
                      shape={"circle"}
                      style={{
                        stroke: "#fff",
                        lineWidth: 1
                      }}
                    />
                  </Chart>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  loading={false}
                  >
                  <Chart 
                    // height={window.innerHeight} 
                    height={400}
                    data={dv} 
                    forceFit>
                    <Axis name="type" title={null} labelOffset={10} />
                    <Axis
                      name="value"
                      title={null}
                      tickLine={null}
                      position="right"
                      formatter={function(val) {
                        return val + "%";
                      }}
                    />
                    <Coord transpose />
                    <Tip />
                    <Legend />
                    <Geom
                      type="intervalStack"
                      position="type*value"
                      color={[
                        "opinion",
                        function(opinion) {
                          return colorMap[opinion];
                        }
                      ]}
                      shape="smooth"
                      opacity={0.8}
                    />
                  </Chart>
                </Card>  
              </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Analysis;
