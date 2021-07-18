import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Steps, 
  Modal,
  Drawer
} from 'antd';
import {
  LineChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';

import './ParameterEstimationSettings.less';
const { Step } = Steps;
export const ParameterEstimationSettings = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showHistoryDrawer = () => {
    setHistoryDrawerClosed(false);
  };

  const onCloseHistoryDrawer = () => {
    setHistoryDrawerClosed(true)
  };

  return (
    <div>
      <Drawer
        title="Parameter Estimation History"
        placement="right"
        closable={true}
        onClose={onCloseHistoryDrawer}
        visible={!historyDrawerClosed}
        getContainer={false}
        mask={false}
        width={500}
        headerStyle={{marginTop: "9px"}}
      >
      </Drawer>

      <Form
        form={form}
        layout="vertical"
        style={{margin: "24px"}}
        // wrapperCol={{ span: 4 }}
      >
        <Form.Item required label="Start Time (s)">
          <Input placeholder="0.0" />
        </Form.Item>
        <Form.Item required label="End Time (s)">
          <Input placeholder="1.0" />
        </Form.Item>
        <Form.Item required label="Solver">
          <Select defaultValue="Rodas4">
            <Select.Option value="Rodas4">Rodas4</Select.Option>
            <Select.Option value="Tsit5">Tsit5</Select.Option>
          </Select>
        </Form.Item>
        <Button className="button" type="primary" onClick={showModal}>Estimate</Button>
        <Button className="button"icon={<CalendarOutlined />} onClick={showHistoryDrawer}>Parameter Estimation History</Button>
      </Form>

      <Modal 
        width="800px" 
        title="Parameter Estimation" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Apply parameters to model"
        okButtonProps={{disabled: true}}
      >
        <Steps current={1} style={{padding: "24px"}}>
          <Step title="Initializing Model"/>
          <Step title="Optimizing" subTitle=" 00:00:08"/>
          <Step title="Done"/>
        </Steps>
      </Modal>
    </div>
  );
};