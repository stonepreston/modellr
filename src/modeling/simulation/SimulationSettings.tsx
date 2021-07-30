import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { send } from '../../sockets/sockets'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { selectModelNodes, selectEdgeNodes } from '../graph_editor/graphEditorSlice'
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

import './SimulationSettings.less';
const { Step } = Steps;


export const SimulationSettings = () => {
  const modelNodes = useAppSelector(state => selectModelNodes(state));
  const edgeNodes = useAppSelector(state => selectEdgeNodes(state));
  const elements = useAppSelector(state => state.graphEditor.elements);
  
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const socket = useRef(new WebSocket("ws://127.0.0.1:8081"));
  const socketID = useRef(uuidv4());

  useEffect(() => {

    socket.current.onopen = () => {
      console.log('Connected to websocket server');
      send(socket.current, socketID.current, "connect");
    };


    socket.current.onmessage = (message) => {
      console.log("Get message from server: " + message);
    };

    let s = socket.current;
    let id = socketID.current
    return () => {
      console.log("closing websocket connection");
      send(s, id, "disconnect");
      s.close();
    }

  }, []);

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

  const onSimulateButtonPressed = () => {
    showModal();
    console.log("elements: ");
    console.log(elements);
    let modelData = {modelNodes: modelNodes, edgeNodes: edgeNodes};
    console.log("sending model to server");
    console.log(modelData)
    send(socket.current, socketID.current, "build_model", modelData);
  };

  return (
    <div>
      <Drawer
        title="Simulation History"
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
        <Button className="button" type="primary" onClick={onSimulateButtonPressed}>Simulate</Button>
        <Button className="button" icon={<LineChartOutlined />} disabled={true}>Results</Button>
        <Button className="button"icon={<CalendarOutlined />} onClick={showHistoryDrawer}>Simulation History</Button>
      </Form>

      <Modal 
        width="800px" 
        title="Simulation" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="View Results"
        okButtonProps={{disabled: true}}
      >
        <Steps current={1} style={{padding: "24px"}}>
          <Step title="Initializing Model"/>
          <Step title="Simulating" subTitle=" 00:00:08"/>
          <Step title="Done"/>
        </Steps>
      </Modal>
    </div>
  );
};