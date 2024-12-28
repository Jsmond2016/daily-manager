import { Col, Input, Row, DatePicker, Select, Form, Space, Button } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "./index.less";
import { sourceMap } from "../../../../utils";
import { filter, map, pipe } from "ramda";
import ApiSelect from "@src/components/ApiSelect";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const { RangePicker } = DatePicker;

const FormItem = ({ label, name, children }) => (
  <Form.Item {...formItemLayout} label={label} name={name}>
    {children}
  </Form.Item>
);

const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  { label: "最近7天", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "最近2周", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "最近1个月", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "最近3个月", value: [dayjs().add(-90, "d"), dayjs()] },
];

const Search = ({ setFilters }) => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    const pipeFns = pipe(
      filter((v: any) => ![undefined, "", null].includes(v)),
      map((v: any) => (typeof v === "string" ? v.trim() : v))
    );
    const newValues: Record<string, any> = pipeFns(values);

    if (newValues.collectDateRange) {
      newValues.collectDateRange = newValues.collectDateRange.map((v) =>
        dayjs(v).valueOf()
      );
    }
    setFilters(newValues);
  };

  return (
    <div className="search-container">
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{ collectDateRange: [dayjs().add(-14, "d"), dayjs()] }}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem label="收藏日期" name="collectDateRange">
              <RangePicker
                placeholder={["开始日期", "结束日期"]}
                presets={rangePresets}
                showTime
                format="YYYY/MM/DD"
              />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem label="所属文件夹名" name="belongToId">
              <ApiSelect />
            </FormItem>
          </Col>
          <Col className="gutter-row" span={6}>
            <FormItem label="书签名" name="bookmarkName">
              <Input />
            </FormItem>
          </Col>

          <Col className="gutter-row" span={6}>
            <Space size="large">
              <Button
                type="default"
                htmlType="reset"
                onClick={() => setFilters({})}
              >
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <FormItem label="按来源分类" name="categoryUrl">
              <Select allowClear>
                {Object.entries(sourceMap).map(([key, name]) => (
                  <Select.Option key={key} value={key}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Search;
