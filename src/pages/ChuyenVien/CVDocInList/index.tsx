import React from "react";
import { Divider, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "id",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Cấp gửi",
    dataIndex: "issuer",
  },
  {
    title: "Loại văn bản",
    dataIndex: "type",
  },
  {
    title: "Số đến theo sổ",
    dataIndex: "arriveId",
  },
  {
    title: "Số ký hiệu gốc",
    dataIndex: "originId",
  },
  {
    title: "Ngày đến",
    dataIndex: "arriveDate",
  },
  {
    title: "Nơi phát hành",
    dataIndex: "issuePlace",
  },
  {
    title: "Trích yếu",
    dataIndex: "summary",
  },
  {
    title: "Toàn văn",
    dataIndex: "fullText",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    title: "Thời hạn xử lý",
    dataIndex: "deadline",
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  },
];

const CVDocInList: React.FC = () => {
  return (
    <div>
      Chỗ của tiêu thức tìm kiếm, bla bla
      <Divider />
      <Table
        rowSelection={{ type: "checkbox" }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default CVDocInList;
