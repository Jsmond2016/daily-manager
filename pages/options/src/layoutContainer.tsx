import React from 'react';
import './layoutContainer.css';
import { Layout } from 'antd';
import { Route, Routes, Navigate } from 'react-router';
import Bookmarks from './views/bookmarks';
import Sections from './views/sections';
import NotFind from './views/not-find';

import MenuContainer from './menu/index';

const { Content, Header, Sider, Footer } = Layout;

const LayoutContainer: React.FC = () => {
  return (
    <Layout className="LayoutContainer" hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
        <MenuContainer />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header style={{ padding: 0 }}>H1-header</Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="bookmarks" />}></Route>
            <Route path="bookmarks" element={<Bookmarks />}></Route>
            <Route path="sections" element={<Sections />}></Route>
            <Route path="*" element={<NotFind />}></Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
