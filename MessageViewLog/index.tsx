import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "slices";
import { fetchMessageLogs } from "slices/messageReportLogs";
import { MessageLogsParams } from "api/reports/getReportLogs";
import moment, { Moment } from "moment";
import { DatePicker, Select, Spin, Card, Row } from "antd";
import styles from "components/Reports/MessageViewLog/styles.module.scss";
import { RangeValue } from "rc-picker/lib/interface";

import MessageInsightDonutCard from "./PieChartForMessage";

import { Table, Tooltip } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

const MessageViewLogs: FC = () => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);

  function handlePaginationCountChange(e) {
    setPageSize(e.pageSize);
  }

  const [params, setParams] = useState<MessageLogsParams>({
    page: 1,
    size: 100,
    name: "Conversation Logs",
    startDate,
    endDate,
    reportType: "CONVERSATION_LOG",
    mode: "REPORT",
  });

  const handleDateChange = (values: RangeValue<Moment>) => {
    if (values === null) {
      return;
    }

    if (values[0] && values[1]) {
      const startDate = values[0].format("YYYY-MM-DD");
      const endDate = values[1].format("YYYY-MM-DD");
      setParams({ ...params, startDate, endDate, templates: null });
      setTemplates([]);
      // const newPArams=params;
      // console.log(newPArams);
      // newPArams.startDate=dates.startDate;
      // newPArams.endDate=dates.endDate;
    }
  };

  useEffect(() => {
    dispatch(fetchMessageLogs(params));
  }, [params]);

  const handleSelectChange = (values: string[]) => {
    setTemplates(values);
  };
  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      templates: templates.join(","), // Include templates only if not empty
    }));
  }, [templates]);

  const dispatch = useAppDispatch();
  const datas = useAppSelector(state => state.messageLogsReport);
  //console.log(datas);
  //for pagination
  const totalCount = datas.data?.response?.totalCount;
  //  const totalPages=datas.data?.response?.totalPages;

  const { loading, error } = datas;
  const dtaForTable = datas?.data?.response?.records;

  const datas2 = useAppSelector(state => state.template.activeTemplates);

  const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  const defaultPArms: MessageLogsParams = {
    page: 1,
    size: 100,
    name: "Conversation Logs",
    startDate,
    endDate,
    reportType: "CONVERSATION_LOG",
    mode: "REPORT",
  };

  useEffect(() => {
    dispatch(fetchMessageLogs(defaultPArms));
  }, []);

  //columns for table
  //text?.slice(0,1)?.toUpperCase()+text?.slice(1,text.length)?.toLowerCase()
  function camelCase(text) {
    return (
      text?.slice(0, 1)?.toUpperCase() +
      text?.slice(1, text?.length)?.toLowerCase()
    );
  }
  const columns_for_table = [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: text => {
        let temp = text.message?.toString()?.split(" ")?.shift();
        return (
          <Tooltip
            title={
              text?.message?.length > 80
                ? truncateText(text.message, 80) + "..."
                : text?.message || "-"
            }
          >
            <span>{temp ?? "-"}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        switch (text) {
          case "READ":
            return (
              (
                <>
                  <div className={styles.parentContainerOfStatusColumn}>
                    <div className={styles.greenColor}></div>
                    <p className={styles.statusColumn}>{text}</p>
                  </div>
                </>
              ) || "-"
            );
          case "RECEIVED":
            return (
              (
                <>
                  <div className={styles.parentContainerOfStatusColumn}>
                    <div className={styles.brownColor}></div>
                    <p className={styles.statusColumn}>{text}</p>
                  </div>
                </>
              ) || "-"
            );
          case "FAILED":
            return (
              (
                <>
                  <div className={styles.parentContainerOfStatusColumn}>
                    <div className={styles.redColor}></div>
                    <p className={styles.statusColumn}>{text}</p>
                  </div>
                </>
              ) || "-"
            );
          case "DELIVERED":
            return (
              (
                <>
                  <div className={styles.parentContainerOfStatusColumn}>
                    <div className={styles.skyBlueColor}></div>
                    <p className={styles.statusColumn}>{text}</p>
                  </div>
                </>
              ) || "-"
            );
          case "ENQUEUED":
            return (
              (
                <>
                  <div className={styles.parentContainerOfStatusColumn}>
                    <div className={styles.yellowColor}></div>
                    <p className={styles.statusColumn}>{text}</p>
                  </div>
                </>
              ) || "-"
            );
          default:
            return (
              (
                <>
                  <p className={styles.statusColumn}>{text}</p>
                </>
              ) || "-"
            );
        }
      },
    },
    {
      title: "Name",
      dataIndex: "contact",
      key: "firstName",
      render: text => text?.firstName || "-",
    },
    {
      title: "Mobile",
      dataIndex: "contact",
      key: "mobile",
      render: text =>
        (
          <span>{`+${text?.mobile?.code}-${text?.mobile?.mobile}` ?? "-"}</span>
        ) || "-",
    },

    {
      title: () => <span>Media Url</span>,
      dataIndex: "message",
      key: "url",
      render: text => {
        //let temp = text?.document?.url?.toString()?.split("/")?.pop();
        return (
          //
          //   <span>{temp || "-"}</span>
          //
          <>
            <Tooltip title={text?.document?.url || "-"}>
              {text?.document?.url?.length > 0 ? (
                <a
                  className={styles.mediaUrl}
                  href={text?.document?.url}
                  target="_blank"
                >
                  Url
                </a>
              ) : (
                "-"
              )}
            </Tooltip>
          </>
        );
      },
    },

    {
      title: "Type",
      dataIndex: "message",
      key: "type",
      render: text => {
        return (
          <>
            <p>
              {text?.type?.includes("_")
                ? text?.type
                    ?.split("_")
                    ?.map(item => camelCase(item))
                    .join(" ")
                : camelCase(text?.type) || "-"}
            </p>
          </>
        );
      },
    },
    {
      title: "Template",
      dataIndex: "template",
      key: "elementName",
      render: text => {
        return (
          <span>
            {text?.elementName
              ?.split("_")
              ?.map(item => camelCase(item))
              .join(" ") || "-"}
          </span>
        );
      },
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (text: string) => camelCase(text) || "-",
    },
    {
      title: () => <span>Source Module</span>,
      dataIndex: "senderSource",
      key: "senderSource",
      render: (text: string) => {
        return <span>{camelCase(text) || "-"}</span>;
      },
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => {
        return <span>{new Date(text)?.toDateString()?.toString() || "-"}</span>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: text => text ?? "-",
    },
    {
      title: () => <span>Agent Name</span>,
      dataIndex: "messageSender",
      key: "firstName",
      render: text => text?.firstName ?? "-",
    },
    {
      title: "Agent Email",
      dataIndex: "messageSender",
      key: "email",
      render: text => text?.email ?? "-",
    },
  ];
  const truncateText = (text, numLength: number) => {
    return text?.length > numLength ? text?.slice(0, numLength) : text;
  };
  return (
    <>
      <Row className={styles.parentContainerOfMessageLog}>
        <Row className={styles.containerOfRangeAndSelect}>
          <Row className={styles.rangePickerContainer}>
            <label htmlFor="date-range" style={{ marginRight: "10px" }}>
              Range <span style={{ color: "red" }}>*</span>
            </label>
            <RangePicker
              className={styles.rangeStyleChanger}
              id="date-range"
              onChange={handleDateChange}
            />
          </Row>
          <Row className={styles.selectMenuContainer}>
            <label htmlFor="template" style={{ marginLeft: "1.8rem" }}>
              Template <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              className={styles.selectMenuStyleChanger}
              id="template"
              mode="multiple"
              placeholder="Select Templates"
              onChange={handleSelectChange}
              value={templates?.map(option => truncateText(option, 5))}
              maxTagCount={3}
              getOptionLabelProp={option => ({
                title: truncateText(option, 5),
              })}
              allowClear
            >
              {datas2.length > 0 &&
                datas2.map((item, idx) => {
                  return (
                    <>
                      <Option value={item.label} key={item._id}>
                        {item.label}
                      </Option>
                    </>
                  );
                })}
            </Select>
          </Row>
        </Row>

        <Row className={styles.chartAndInformationContainer}>
          {/* <DemoPie/> */}

          <MessageInsightDonutCard loading={loading} />
        </Row>

        <Row className={styles.tableContainer}>
          <Card title="Message Logs" className={styles.messageTableScroll}>
            <Table
              loading={loading}
              columns={columns_for_table}
              dataSource={dtaForTable}
              pagination={{
                position: ["bottomLeft"],
                pageSize: 5,
                total: totalCount,
                onChange: handlePaginationCountChange,
                showTotal: (total, range) =>
                  `Showing ${range[1]} of ${total} Messages`,
              }}
              scroll={{ x: true }} // Enable horizontal scrolling
            />
          </Card>
        </Row>
      </Row>
    </>
  );
};

export default MessageViewLogs;
