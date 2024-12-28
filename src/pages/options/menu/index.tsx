import React, { useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./logo.svg";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("书签管理", "/bookmarks", <PieChartOutlined />),
  getItem("片段管理", "/sections", <DesktopOutlined />),
  getItem("日报管理", "/daily-notes", <ContainerOutlined />),

  // getItem('Navigation One', 'sub1', <MailOutlined />, [
  //   getItem('Option 5', '5'),
  //   getItem('Option 6', '6'),
  //   getItem('Option 7', '7'),
  //   getItem('Option 8', '8'),
  // ]),

  // getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
  //   getItem('Option 9', '9'),
  //   getItem('Option 10', '10'),

  //   getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  // ]),
];

const getNodeMap = (
  node: any,
  parent?: string | undefined,
  leave: number = 0
) => {
  node.parent = parent;
  node.leave = leave;
  const nodeMap = [node];
  if (node.children && node.children.length) {
    leave++;
    node.children.forEach((item: any) =>
      nodeMap.push(...getNodeMap(item, node.key, leave))
    );
  }
  return nodeMap;
};
const getTreeMap = (tree: any) => {
  const treeMap: [] = [];
  tree.forEach((node: any) => {
    // @ts-ignore
    treeMap.push(...getNodeMap(node));
  });
  return treeMap;
};

const MenuContainer: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 编程式跳转路由,利用到 hooks
  const navigateTo = useNavigate();
  // 组件加载完成
  // useEffect(() => {
  //   const token = localStorage.getItem("token")
  //   if (!token) {
  //     navigateTo("/login", { replace: true })
  //   }
  // }, [])
  // 当前路由信息
  const currentRoute = useLocation();
  const getTreeMenuList = getTreeMap(items);
  const getNowActive = (
    currentPath?: string | undefined,
    arr: [] = getTreeMenuList,
    resultList: string[] = []
  ) => {
    const path = currentPath ? currentPath : currentRoute.pathname;
    const currentMenuObj: any = arr.find(
      (item: { key: string }) => item.key === path
    );
    if (currentMenuObj) {
      resultList.unshift(currentMenuObj.key);
      currentMenuObj.parent
        ? getNowActive(currentMenuObj.parent, arr, resultList)
        : "";
    }
    return resultList;
  };
  // 菜单展开项的初始值
  let firstOpenKey: string[] = getNowActive();
  const [openKeys, setOpenKeys] = useState(firstOpenKey);
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys([...keys]);
  };
  const menuClick: MenuProps["onClick"] = (e) => {
    console.log("e.key: ", e.key);
    navigateTo(e.key);
    setOpenKeys(getNowActive(e.key));
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          height: "64px",
          textAlign: "center",
          color: "white",
          fontSize: "32px",
          lineHeight: "64px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          height={48}
          style={{ verticalAlign: "middle" }}
        />{" "}
        <span>酷书签</span>
      </div>
      <Menu
        selectedKeys={[currentRoute.pathname]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={menuClick}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        style={{ height: "calc(100% - 64px)" }}
      />
    </div>
  );
};

export default MenuContainer;
