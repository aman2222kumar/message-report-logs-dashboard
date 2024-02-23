import axios from "api/axios";
import type { Report } from "types";

export interface GetReportLogsParams {
  page: number;
  size: number;
  order_column?: string;
  order_by?: "ASC" | "DESC";
}

//meesage params
export interface MessageLogsParams {
  page: number;
  size: number;
  name:"Conversation Logs";
  startDate: string;
  endDate: string;
  reportType:"CONVERSATION_LOG";
  mode:"REPORT" | "EXPORT_REPORT";
  broadcasts?:string[];
  templates?:string[];



}

//message response data
export interface GetMessageResponse {
  response: {
    totalCount:number;
    records:Array<MessageReport>;
    totalPages:number;
    currentPage:number;
  };
  insight: {
    total:number;
    inbound:number;
    outbound:number;
    outboundInsights:{
      failed:number;
      read:number;
      delivered:number;
      enqueued:number;
    }
  };
}
//message records data types
export interface MessageReport{
  _id:string;
  contact:{
    _id:string;
    mobile:{
     country:string;
     mobile:string;
     code:number;
    };
    firstName:string;
    meta?:object;
   


  };
  source:string;
  status:string;
  messageSender?:{
    _id?:string;
    email?:string;
    firstName?:string;
  };
  message?:object;

  template?:object;

  templateId?:string;
  senderSource?:string;
  remarks?:string;
  createdAt?:string;

}


export interface GetReportLogsResponse {
  currentPage: number;
  records: Array<Report>;
  totalCount: number;
  totalPages: number;
}

const getReportLogs = async (
  params: GetReportLogsParams,
): Promise<GetReportLogsResponse> => {
  const response = await axios.get<GetReportLogsResponse>("v1/report/list", {
    params,
  });

  return response.data;
};

//message logs function axios call
export const getMessagetLogs = async (
  params: MessageLogsParams,
): Promise<GetMessageResponse> => {
  const response = await axios.get<GetMessageResponse>("v1/reports/export/conversation", {
    params,
  });

  return response.data;
};

export default getReportLogs;
