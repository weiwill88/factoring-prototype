'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Segmented, Typography, theme, Button, Space, Dropdown } from 'antd';
import {
  TagsOutlined, DollarOutlined, AppstoreOutlined, FileProtectOutlined,
  TeamOutlined, DashboardOutlined, UserAddOutlined, CreditCardOutlined,
  FileTextOutlined, FundOutlined, BankOutlined, AuditOutlined,
  SwapOutlined, AccountBookOutlined, BarChartOutlined, AimOutlined,
  SafetyOutlined, CalendarOutlined, WalletOutlined, SettingOutlined,
  SolutionOutlined, ReconciliationOutlined, ContainerOutlined, SnippetsOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, LogoutOutlined, UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { PortalType } from '@/lib/types';
import { resetAppData } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type AntMenuItem = Required<MenuProps>['items'][number];

const adminMenuItems: AntMenuItem[] = [
  { key: '/admin/tags', icon: <TagsOutlined />, label: '标签管理' },
  { key: '/admin/pricing', icon: <DollarOutlined />, label: '产品定价' },
  { key: '/admin/products', icon: <AppstoreOutlined />, label: '产品管理' },
  { key: '/admin/agreements', icon: <FileProtectOutlined />, label: '协议管理' },
  { key: '/admin/roles', icon: <TeamOutlined />, label: '角色权限' },
];

const supplierMenuItems: AntMenuItem[] = [
  { key: '/supplier/dashboard', icon: <DashboardOutlined />, label: '驾驶舱' },
  { key: '/supplier/register', icon: <UserAddOutlined />, label: '注册管理' },
  { key: '/supplier/credit', icon: <CreditCardOutlined />, label: '我的额度' },
  { key: '/supplier/financing', icon: <FileTextOutlined />, label: '业务管理-国内保理' },
  { key: '/supplier/assets', icon: <FundOutlined />, label: '资产管理' },
  { key: '/supplier/fees', icon: <AccountBookOutlined />, label: '费用管理' },
  { key: '/supplier/agreements', icon: <FileProtectOutlined />, label: '我的协议' },
];

const funderMenuItems: AntMenuItem[] = [
  {
    key: 'customer-group', icon: <TeamOutlined />, label: '客群管理',
    children: [
      { key: '/funder/customers', icon: <SolutionOutlined />, label: '客户管理' },
      { key: '/funder/customer-tiers', icon: <AimOutlined />, label: '供应商档次管理' },
    ],
  },
  {
    key: 'credit-group', icon: <CreditCardOutlined />, label: '额度管理',
    children: [
      { key: '/funder/credit/core-enterprise', icon: <BankOutlined />, label: '核心企业额度' },
      { key: '/funder/credit/supplier', icon: <SafetyOutlined />, label: '供应商额度' },
    ],
  },
  {
    key: 'business-group', icon: <AuditOutlined />, label: '业务管理',
    children: [
      { key: '/funder/business/pool', icon: <ContainerOutlined />, label: '池保理' },
      { key: '/funder/business/pre-factoring', icon: <ReconciliationOutlined />, label: '预保理' },
      { key: '/funder/business/domestic', icon: <SnippetsOutlined />, label: '国内保理-补' },
      { key: '/funder/business/bills', icon: <FileTextOutlined />, label: '票据保理-补' },
    ],
  },
  {
    key: 'settlement-group', icon: <SwapOutlined />, label: '结算',
    children: [
      { key: '/funder/settlement/bills', icon: <FileTextOutlined />, label: '票据管理' },
      { key: '/funder/settlement/tail-transfer', icon: <SwapOutlined />, label: '尾款划转' },
      { key: '/funder/settlement/refund-transfer', icon: <SwapOutlined />, label: '退息划转' },
    ],
  },
  {
    key: 'marketing-group', icon: <BarChartOutlined />, label: '市场经营',
    children: [
      { key: '/funder/marketing/metrics', icon: <BarChartOutlined />, label: '业务指标管理' },
      { key: '/funder/marketing/customers', icon: <TeamOutlined />, label: '客户营销管理' },
      { key: '/funder/marketing/dashboard', icon: <DashboardOutlined />, label: '核心企业看板' },
      { key: '/funder/marketing/annual-target', icon: <CalendarOutlined />, label: '年度目标' },
    ],
  },
  { key: '/funder/accounts', icon: <WalletOutlined />, label: '账户管理' },
];

const portalConfig: Record<PortalType, { label: string; menu: AntMenuItem[] }> = {
  admin: { label: '银行管理', menu: adminMenuItems },
  supplier: { label: '供应商', menu: supplierMenuItems },
  funder: { label: '资金方', menu: funderMenuItems },
};

function getPortalFromPath(pathname: string): PortalType {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/supplier')) return 'supplier';
  if (pathname.startsWith('/funder')) return 'funder';
  return 'supplier';
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = theme.useToken();
  const { isLoggedIn, username, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [portal, setPortal] = useState<PortalType>(() => getPortalFromPath(pathname));

  useEffect(() => {
    setPortal(getPortalFromPath(pathname));
  }, [pathname]);

  const handlePortalChange = (value: string | number) => {
    const newPortal = value as PortalType;
    setPortal(newPortal);
    const defaultPaths: Record<PortalType, string> = {
      admin: '/admin/tags',
      supplier: '/supplier/dashboard',
      funder: '/funder/customers',
    };
    router.push(defaultPaths[newPortal]);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    const items = portalConfig[portal].menu;
    const allKeys: string[] = [];
    const extractKeys = (menuItems: AntMenuItem[]) => {
      menuItems.forEach((item) => {
        if (item && 'key' in item) {
          allKeys.push(item.key as string);
          if ('children' in item && item.children) {
            extractKeys(item.children as AntMenuItem[]);
          }
        }
      });
    };
    extractKeys(items);
    return allKeys.filter(k => pathname.startsWith(k));
  };

  const getOpenKeys = () => {
    const items = portalConfig[portal].menu;
    const openKeys: string[] = [];
    items.forEach((item) => {
      if (item && 'children' in item && item.children) {
        const children = item.children as AntMenuItem[];
        const hasActive = children.some(c => c && 'key' in c && pathname.startsWith(c.key as string));
        if (hasActive && 'key' in item) {
          openKeys.push(item.key as string);
        }
      }
    });
    return openKeys;
  };

  if (pathname === '/login' || pathname === '/') return <>{children}</>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        theme="dark"
        style={{
          background: 'linear-gradient(180deg, #0A1628 0%, #0F2035 100%)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2B6CB0, #4299E1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(43,108,176,0.4)',
          }}>
            <BankOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          {!collapsed && (
            <Title level={4} style={{ margin: '0 0 0 12px', color: '#fff', whiteSpace: 'nowrap', fontWeight: 600 }}>
              保理系统
            </Title>
          )}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={portalConfig[portal].menu}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 0',
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s', background: '#F7F8FA' }}>
        <Header style={{
          background: '#ffffff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          height: 64,
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#4A5568' }}
            />
            <Segmented
              options={[
                { label: '银行管理', value: 'admin' },
                { label: '供应商', value: 'supplier' },
                { label: '资金方', value: 'funder' },
              ]}
              value={portal}
              onChange={handlePortalChange}
            />
          </Space>
          <Space>
            <Text style={{ fontSize: 13, color: '#4A5568' }}><UserOutlined /> {username || 'admin'}</Text>
            <Dropdown menu={{ items: [
              { key: 'reset', label: '重置数据', icon: <ReloadOutlined />, onClick: () => { resetAppData(); window.location.reload(); } },
              { type: 'divider' as const },
              { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true, onClick: logout },
            ] }}>
              <Button type="text" icon={<SettingOutlined />} style={{ color: '#4A5568' }} />
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
