import React, { PureComponent } from "react";
import { connect } from "dva";
import DescriptionList from "@/components/DescriptionList";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import styles from "./TxDetail.less";
import { routerRedux } from "dva/router";
import moment from "moment";
import { Form, Card, Timeline, Divider } from "antd";

const { Description } = DescriptionList;

@connect(({ txdetail, loading }) => ({
  txdetail,
  loading: loading.models.txdetail
}))
@Form.create()
class TxDetail extends PureComponent {
  state = {};

  dateFormat = datestr => {
    if (datestr == null) return "";
    let date = datestr.substring(0, 10);
    let time = datestr.substring(11, 19);
    return date + " " + time;
  };

  componentDidMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: "txdetail/fetch",
      payload: {
        txHash: location.query.txHash
      }
    });
  }

  render() {
    const {
      txdetail: { userInfo, txInfo },
      dispatch
    } = this.props;
    return (
      <PageHeaderWrapper title="转账详情">
        <Card bordered={false}>
          <DescriptionList
            size="large"
            title="操作用户信息"
            style={{ marginBottom: 32 }}
          >
            <Description term="用户编号">
              {
                <span>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      dispatch(
                        routerRedux.push({
                          pathname: "/txuser/user_detail",
                          query: {
                            settlement_account_name:
                              userInfo.settlement_account_name
                          }
                        })
                      );
                    }}
                  >
                    {userInfo.settlement_account_name}
                  </a>
                </span>
              }
            </Description>
            <Description term="姓名">{userInfo.name}</Description>
            <Description term="手机号">{userInfo.mobile}</Description>
            <Description term="钱包地址">{userInfo.cpct_address}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <Timeline>
            <Timeline.Item color="green">
              交易哈希: {txInfo.txHash}
            </Timeline.Item>
            <Timeline.Item color="green">
              区块高度: {txInfo.blockHeight}
            </Timeline.Item>
            <Timeline.Item color="green">
              交易日期:{" "}
              {moment(new Date(txInfo.timestamp * 1000)).format(
                "YYYY-MM-DD HH:mm:SS"
              )}
            </Timeline.Item>
            <Timeline.Item color="green">
              转出地址: {txInfo.token_from}
            </Timeline.Item>
            <Timeline.Item color="green">
              转入地址: {txInfo.token_to}
            </Timeline.Item>
            <Timeline.Item color="green">
              交易数量: {txInfo.value.substring(0, txInfo.value.length - 18)}
            </Timeline.Item>
            <Timeline.Item color="green">
              gas limit: {txInfo.gasLimit}
            </Timeline.Item>
            <Timeline.Item color="green">
              gas price: {txInfo.gasPrice}
            </Timeline.Item>
            <Timeline.Item color="green">
              gas used: {txInfo.gasUsed + " wei"}
            </Timeline.Item>
          </Timeline>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TxDetail;
