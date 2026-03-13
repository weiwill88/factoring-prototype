import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from '@/components/layout/AppLayout';
import "./globals.css";

export const metadata: Metadata = {
  title: "保理业务管理系统",
  description: "保理系统可交互原型 — Interactive Factoring System Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <ConfigProvider locale={zhCN} theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 6,
            },
          }}>
            <AppLayout>{children}</AppLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
