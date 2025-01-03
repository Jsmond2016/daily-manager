import type { ColumnsType, TableProps } from 'antd/es/table';
import type { IBookMark } from '../..';
import { useMemo } from 'react';
import Table from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { Button, Modal, Space, message, Typography, Tooltip } from 'antd';
import { removeBookmark } from '@extension/service';
import { useGroupListStore } from '@extension/store';
import { BOOKMARK_CUSTOM_SPLIT } from '@extension/constants';

const { Paragraph, Link } = Typography;

export type IProps = {
  list: IBookMark[];
  editBookmark: (record: IBookMark) => void;
  rowSelection: TableProps<IBookMark>['rowSelection'];
  refreshList: () => void;
  current: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
};

const List = (props: IProps) => {
  const { editBookmark, list, rowSelection, refreshList, current, pageSize, onPageChange } = props;

  const { groupList } = useGroupListStore();

  const groupListMap = useMemo(() => {
    return groupList.reduce((pre, cur) => {
      pre.set(cur.id, cur.title);
      return pre;
    }, new Map());
  }, [groupList]);

  const copyBookmark = async (record: IBookMark) => {
    const { url, title } = record;
    const text = `- [${title}](${url})`;
    // refer: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    const res = await navigator.clipboard.writeText(text);
    console.log('res: ', res);
    message.success('复制成功!');
  };

  const deleteBookmark = async (record: IBookMark) => {
    Modal.confirm({
      title: '确定删除吗？',
      onOk: async () => {
        try {
          await removeBookmark(record);
          message.success('删除成功');
          refreshList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 书签名/链接/文章名/来源/自定义描述/
  const columns: ColumnsType<IBookMark> = [
    {
      title: '书签名',
      dataIndex: 'title',
      width: 360,
      render: (v, record) => {
        const sourceTitle = v.split(BOOKMARK_CUSTOM_SPLIT)[0]?.trim();
        return (
          <Tooltip title={sourceTitle}>
            <Paragraph ellipsis style={{ width: '360px' }}>
              <Link href={record.url}>{sourceTitle}</Link>
            </Paragraph>
          </Tooltip>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 360,
      render: (v, record) => (
        <Paragraph style={{ width: '360px' }}>{record.title.split(BOOKMARK_CUSTOM_SPLIT)[1]?.trim()}</Paragraph>
      ),
    },
    {
      title: '收藏时间',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
    },
    {
      title: '所属文件夹',
      dataIndex: 'belongToDir',
      width: 120,
      render: (v, record) => groupListMap.get(record.parentId),
    },
    // {
    //   title: "自定义描述",
    //   dataIndex: "description",
    //   width: 120,
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 180,
      render: (v, record) => (
        <Space size="small" direction="horizontal">
          <Button type="link" onClick={() => copyBookmark(record)}>
            复制
          </Button>
          <Button type="link" onClick={() => editBookmark(record)}>
            修改
          </Button>
          <Button type="link" danger onClick={() => deleteBookmark(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const width = columns.reduce((pre, cur) => ((pre += +(cur.width || 0)), pre), 0);

  const showTotal: PaginationProps['showTotal'] = total => `总共 ${total} 条`;

  const pagination = {
    total: list.length,
    defaultCurrent: 1,
    current,
    pageSize,
    onChange: onPageChange,
    showTotal,
    pageSizeOptions: [10, 20, 30, 40, 50],
  };

  return (
    <Table<IBookMark>
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      pagination={pagination}
      columns={columns}
      dataSource={list}
      scroll={{ x: width + 160 }}
    />
  );
};

export default List;
