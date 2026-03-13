'use client';

import React, { useState } from 'react';
import { Card, Steps, Form, Input, Select, Button, Space, Upload, Checkbox, Cascader, Typography, Row, Col, Tag, message, Divider, Table, Result } from 'antd';
import { UploadOutlined, InboxOutlined, PhoneOutlined, SafetyCertificateOutlined, UserOutlined, BankOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getAppData, saveAppData, generateId } from '@/lib/mockData';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const regionOptions = [
  { value: '上海', label: '上海', children: [{ value: '浦东新区', label: '浦东新区' }, { value: '黄浦区', label: '黄浦区' }, { value: '徐汇区', label: '徐汇区' }] },
  { value: '北京', label: '北京', children: [{ value: '朝阳区', label: '朝阳区' }, { value: '海淀区', label: '海淀区' }] },
  { value: '广东', label: '广东', children: [{ value: '深圳', label: '深圳' }, { value: '广州', label: '广州' }] },
  { value: '重庆', label: '重庆', children: [{ value: '渝北区', label: '渝北区' }, { value: '江北区', label: '江北区' }] },
];

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [agreements, setAgreements] = useState({ platform: false, cfca: false });

  const handleSubmit = () => {
    const v2 = form2.getFieldsValue();
    const appData = getAppData();
    appData.suppliers.push({
      id: generateId('sup'),
      companyName: v2.companyName || '新注册企业',
      unifiedCreditCode: v2.creditCode || '',
      enterpriseNature: v2.nature || '',
      industry: v2.industry || '',
      province: v2.region?.[0] || '',
      city: v2.region?.[1] || '',
      address: v2.address || '',
      employeeCount: v2.employeeCount,
      legalRepName: v2.legalRepName || '',
      legalRepIdType: v2.legalRepIdType || '身份证',
      legalRepIdNumber: v2.legalRepIdNumber || '',
      operatorName: v2.operatorName || '',
      operatorPhone: v2.operatorPhone || '',
      operatorEmail: v2.operatorEmail || '',
      customerManager: v2.customerManager,
      registrationDate: new Date().toISOString().split('T')[0],
      status: '待审批',
    });
    saveAppData(appData);
    setSubmitted(true);
    message.success('注册申请已提交！');
  };

  if (submitted) {
    return (
      <Card>
        <Result status="success" title="注册申请已提交"
          subTitle="您的注册信息已成功提交，请等待客户经理审批。"
          extra={[
            <Button type="primary" key="back" onClick={() => { setSubmitted(false); setCurrent(0); form1.resetFields(); form2.resetFields(); }}>返回重新注册</Button>,
          ]}
        />
      </Card>
    );
  }

  const steps = [
    {
      title: '手机号验证',
      icon: <PhoneOutlined />,
      content: (
        <Form form={form1} layout="vertical" style={{ maxWidth: 480, margin: '40px auto' }}>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input size="large" placeholder="请输入手机号" prefix={<PhoneOutlined />} maxLength={11} />
          </Form.Item>
          <Form.Item label="图形验证码" name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
            <Space>
              <Input size="large" placeholder="验证码" style={{ width: 200 }} />
              <div style={{ width: 120, height: 40, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', fontSize: 18, fontWeight: 'bold', color: '#1677ff', letterSpacing: 4, fontFamily: 'monospace' }}>
                A3K7
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="短信验证码" name="smsCode" rules={[{ required: true, message: '请输入短信验证码' }]}>
            <Space>
              <Input size="large" placeholder="6位验证码" style={{ width: 200 }} maxLength={6} />
              <Button size="large">获取验证码</Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '注册信息',
      icon: <UserOutlined />,
      content: (
        <Form form={form2} layout="vertical" style={{ maxWidth: 800, margin: '20px auto' }}>
          <Card title="企业信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="企业名称" name="companyName" rules={[{ required: true }]}><Input placeholder="请输入企业全称" /></Form.Item></Col>
              <Col span={12}><Form.Item label="统一社会信用代码" name="creditCode" rules={[{ required: true }]}><Input placeholder="18位" maxLength={18} /></Form.Item></Col>
              <Col span={12}><Form.Item label="国税登记证号" name="taxNumber"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item label="企业性质" name="nature" rules={[{ required: true }]}><Select options={['有限责任公司','股份有限公司','个人独资','合伙企业','外商投资'].map(v => ({ label: v, value: v }))} /></Form.Item></Col>
              <Col span={12}><Form.Item label="所属行业" name="industry" rules={[{ required: true }]}><Select options={['制造业','信息技术','建筑业','交通运输','批发零售','服务业'].map(v => ({ label: v, value: v }))} /></Form.Item></Col>
              <Col span={12}><Form.Item label="注册省市" name="region" rules={[{ required: true }]}><Cascader options={regionOptions} placeholder="选择省市" /></Form.Item></Col>
              <Col span={12}><Form.Item label="详细地址" name="address"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item label="从业人数" name="employeeCount"><Input type="number" /></Form.Item></Col>
            </Row>
          </Card>

          <Card title="法人信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Form.Item label="法人姓名" name="legalRepName" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item label="证件类型" name="legalRepIdType" rules={[{ required: true }]}><Select defaultValue="身份证" options={[{ label: '身份证', value: '身份证' }, { label: '护照', value: '护照' }]} /></Form.Item></Col>
              <Col span={8}><Form.Item label="证件号码" name="legalRepIdNumber" rules={[{ required: true }]}><Input maxLength={18} /></Form.Item></Col>
            </Row>
            <Space><Text>人脸识别：</Text><Tag color="green"><SafetyCertificateOutlined /> 已通过（模拟）</Tag></Space>
          </Card>

          <Card title="操作人员信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Form.Item label="姓名" name="operatorName" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item label="手机号" name="operatorPhone" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item label="邮箱" name="operatorEmail"><Input /></Form.Item></Col>
            </Row>
          </Card>

          <Card title="归属客户经理" size="small" style={{ marginBottom: 16 }}>
            <Form.Item name="customerManager">
              <Select showSearch placeholder="搜索客户经理" options={[
                { label: '王建国', value: '王建国' }, { label: '李雪梅', value: '李雪梅' },
                { label: '赵刚', value: '赵刚' }, { label: '均不在列表中', value: '均不在列表中' },
              ]} />
            </Form.Item>
          </Card>

          <Card title="签约渠道" size="small">
            <Input value="网页" disabled />
          </Card>
        </Form>
      ),
    },
    {
      title: '上传资料',
      icon: <UploadOutlined />,
      content: (
        <div style={{ maxWidth: 800, margin: '20px auto' }}>
          <Card title="附件上传" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              {[
                { name: '营业执照', required: true }, { name: '法人身份证正面', required: true },
                { name: '法人身份证反面', required: true }, { name: '开户许可证', required: true },
                { name: '近一月财务报表', required: false }, { name: '近一年财务报表', required: false },
                { name: '征信授权书', required: false }, { name: '经办人授权', required: false },
                { name: '数字证书授权', required: false }, { name: '签约权限申请书', required: false },
                { name: '其他资料', required: false },
              ].map(item => (
                <Col xs={24} sm={12} md={8} key={item.name}>
                  <Card size="small" title={<>{item.name} {item.required && <Text type="danger">*</Text>}</>}>
                    <Upload.Dragger style={{ padding: '8px 0' }} beforeUpload={() => false}>
                      <p><InboxOutlined style={{ fontSize: 24, color: '#1677ff' }} /></p>
                      <p style={{ fontSize: 12 }}>点击或拖拽上传</p>
                    </Upload.Dragger>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="OCR 识别结果（模拟）" size="small" style={{ marginBottom: 16 }}>
            <Table size="small" pagination={false} bordered dataSource={[
              { key: '1', field: '营业收入', value: '¥ 12,500万', source: '财务报表自动识别' },
              { key: '2', field: '净利润', value: '¥ 890万', source: '财务报表自动识别' },
              { key: '3', field: '资产总额', value: '¥ 8,200万', source: '财务报表自动识别' },
              { key: '4', field: '负债总额', value: '¥ 3,100万', source: '财务报表自动识别' },
            ]} columns={[
              { title: '字段', dataIndex: 'field' }, { title: '识别结果', dataIndex: 'value' },
              { title: '来源', dataIndex: 'source', render: (v: string) => <Tag color="blue">{v}</Tag> },
            ]} />
          </Card>

          <Card title="协议签署" size="small">
            <Space direction="vertical">
              <Checkbox checked={agreements.platform} onChange={e => setAgreements({ ...agreements, platform: e.target.checked })}>
                我已阅读并同意《保理系统平台服务协议》
              </Checkbox>
              <Checkbox checked={agreements.cfca} onChange={e => setAgreements({ ...agreements, cfca: e.target.checked })}>
                我已阅读并同意《CFCA数字证书授权协议》
              </Checkbox>
            </Space>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>供应商注册</Title>
      <Card>
        <Steps current={current} items={steps.map(s => ({ title: s.title, icon: s.icon }))} style={{ marginBottom: 24 }} />
        <div>{steps[current].content}</div>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            {current > 0 && <Button size="large" onClick={() => setCurrent(current - 1)}>上一步</Button>}
            {current < steps.length - 1 && (
              <Button type="primary" size="large" onClick={() => setCurrent(current + 1)}>下一步</Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" size="large" onClick={handleSubmit}
                disabled={!agreements.platform || !agreements.cfca}>
                提交注册
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}
