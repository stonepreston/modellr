import React, { useEffect, useState } from 'react';
import { send } from '../../sockets/sockets'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { selectModelNodes, selectEdgeNodes } from '../graph_editor/graphEditorSlice'
import { setResults, ResultItem } from '../results/resultsSlice'
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
  Link
} from "react-router-dom";

import {
  LineChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';

import './SimulationSettings.less';
const { Step } = Steps;

enum SimulationStage {
  Initializing = 0,
  Simulating,
  Done
}

type SimulationSettingsProps = {
  socket: WebSocket;
  socketID: string;
}


export const SimulationSettings = ({ socket, socketID }: SimulationSettingsProps) => {
  const dispatch = useAppDispatch();
  const modelNodes = useAppSelector(state => selectModelNodes(state));
  const edgeNodes = useAppSelector(state => selectEdgeNodes(state));
  const elements = useAppSelector(state => state.graphEditor.elements);
  
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const [simulationStage, setSimulationStage] = useState<SimulationStage>(SimulationStage.Initializing)
  
  useEffect(() => {

    socket.onmessage = (message) => {
      console.log("Get message from server: ", message);
      if (message.data === "simulating") {
        setSimulationStage(SimulationStage.Simulating)
      } else if (message.data === "done") {
        setSimulationStage(SimulationStage.Done)
      } else {
        console.log("Got results!");
        console.log("raw results: ", message.data);
        const results: ResultItem[] = JSON.parse(message.data);
        console.log("results in socket handler: ", results);
        dispatch(setResults(results));
      }

    };

  }, [dispatch, socket]);

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
    setSimulationStage(SimulationStage.Initializing);

    showModal();
    console.log("elements: ");
    console.log(elements);
    let modelData = {modelNodes: modelNodes, edgeNodes: edgeNodes};
    console.log("sending model to server");
    console.log(modelData)
    send(socket, socketID, "build_model", modelData);
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
        <Form.Item>
          <Input addonBefore="Start Time (s)" placeholder="0.0" />
        </Form.Item>
        <Form.Item>
          <Input addonBefore="End Time (s)" placeholder="0.0" />
        </Form.Item>
        <Form.Item label="Solver">
          <Select defaultValue="Rodas4">
            <Select.Option value="Rodas4">Rodas4</Select.Option>
            <Select.Option value="Tsit5">Tsit5</Select.Option>
          </Select>
        </Form.Item>
        <Button className="button" type="primary" onClick={onSimulateButtonPressed}>Simulate</Button>
        <Link to="/results">
          <Button className="button" icon={<LineChartOutlined />} disabled={simulationStage !== SimulationStage.Done}>
            Results
          </Button>
        </Link>
        <Button className="button"icon={<CalendarOutlined />} onClick={showHistoryDrawer}>Simulation History</Button>
      </Form>

      <Modal 
        width="800px" 
        title="Simulation" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Ok"
        okButtonProps={{disabled: simulationStage !== SimulationStage.Done}}
      >
        <Steps current={simulationStage} style={{padding: "24px"}}>
          <Step title="Initializing Model"/>
          <Step title="Simulating"/>
          <Step title="Done"/>
        </Steps>
      </Modal>
    </div>
  );
};