import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from '@/components/layout/AppLayout';
import { AuthProvider } from '@/lib/auth';
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
              colorPrimary: '#2B6CB0',
              colorInfo: '#2B6CB0',
              colorSuccess: '#38A169',
              colorWarning: '#D69E2E',
              colorError: '#E53E3E',
              borderRadius: 10,
              colorBgContainer: '#ffffff',
              colorBgLayout: '#F7F8FA',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            },
            components: {
              Card: { borderRadiusLG: 12 },
              Button: { borderRadius: 8 },
              Input: { borderRadius: 8 },
              Select: { borderRadius: 8 },
              Table: { borderRadius: 8 },
              Segmented: { borderRadius: 8 },
            },
          }}>
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
