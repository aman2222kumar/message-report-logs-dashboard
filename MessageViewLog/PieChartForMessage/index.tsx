import { useAppSelector } from "slices";

import React from "react";
import { Card } from "antd";
import Donut from "components/UI/Gaph/Donut";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { GraphDatatType } from "types";
import { Row, Col } from "antd";
import styles from "components/Reports/MessageViewLog/PieChartForMessage/styles.module.scss";
import { BsArrowUpRightSquareFill } from "react-icons/bs";

const MessageInsightDonutCard: React.FC<{ loading: boolean }> = ({
  loading,
}) => {
  const datainsight = useAppSelector(
    state => state.messageLogsReport.data?.insight,
  );

  const datainsight_outboundInsight = datainsight?.outboundInsight;
  console.log(datainsight_outboundInsight);

  const feedbackData: GraphDatatType[] = [
    {
      type: `${datainsight?.inbound} Inbound Conversations`,
      value: datainsight?.inbound ?? 0,
    },
    {
      type: `${datainsight?.outbound} Outbound Conversations`,
      value: datainsight?.outbound ?? 0,
    },
  ];

  const dataForList = [
    { name: "Total", value: datainsight?.total ?? "-" },
    { name: "Delivered", value: datainsight_outboundInsight?.delivered ?? "-" },
    { name: "Enqueued", value: datainsight_outboundInsight?.enqueued ?? "-" },
    { name: "Failed", value: datainsight_outboundInsight?.failed ?? "-" },
    { name: "Read", value: datainsight_outboundInsight?.read ?? "-" },
  ];

  const colorsArray = ["#9ECC3B", "#F4CA17"];

  return (
    <>
      <Row className={styles.chartContainer}>
        <Card className={styles.donutCard}>
          <Donut
            className={styles.donutChart}
            loading={loading}
            icon={<RiQuestionAnswerFill size={22} />}
            data={feedbackData}
            angleField={"value"}
            colorField={"type"}
            subText={"Messages"}
            subTextFontSize={"1.2rem"}
            textFontSize={"20px"}
            innerRadius={0.8}
            colorsArray={colorsArray}
            contentFontSize="32"
            titleFontSize="32"
            legendLayout={"vertical"}
            laygendPosition={"right"}
            height={250}
            width={500}
            appendPadding={23}
            titleOffsetY={-18}
            contentOffsetY={-10}
            laygendOffsetX={-40}
          />
        </Card>

        <Card className={styles.boundInfoCard}>
          <div className={styles.titleBound}>
            <p>{<BsArrowUpRightSquareFill size={25} />}</p>
            <p>Outbound Messages</p>
          </div>
          <Row className={styles.boundInfo}>
            {dataForList.length > 0 &&
              dataForList.map(item => (
                <Col key={item.name} className={styles.colData}>
                  <p className={styles.boundText}>{item.value}</p>
                  <p>{item.name}</p>
                </Col>
              ))}
          </Row>
        </Card>
      </Row>
    </>
  );
};

export default MessageInsightDonutCard;
