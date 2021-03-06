import React, { useState, useEffect } from 'react';
import { send } from '../../sockets/sockets'
import { useAppSelector } from '../../hooks'
import { selectModelNodes, selectEdgeNodes } from '../graph_editor/graphEditorSlice'

import { 
  Form, 
  Input, 
  Button, 
  Steps, 
  Modal,
  Drawer,
  Typography,
  Collapse,
  Table
} from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';

import './ParameterEstimationSettings.less';
const { Title } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const columns = [
  {
    title: 'Parameter',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Optimized Value',
    dataIndex: 'value',
    key: 'value',
  },
];

enum EstimationStage {
  Initializing = 0,
  Optimizing,
  Done
}

type ParameterEstimationSettingsProps = {
  socket: WebSocket;
  socketID: string;
}


export const ParameterEstimationSettings = ({ socket, socketID }: ParameterEstimationSettingsProps) => {

  interface StatesObject {
    [key: string]: any
  }

  interface OptimizedParameter {
    name: string;
    value: number;
  }

  
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [states, setStates] = useState<StatesObject>({});
  const [optimizedParameters, setOptimizedParameters] = useState<OptimizedParameter[]>([]);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const [estimationStage, setEstimationStage] = useState<EstimationStage>(EstimationStage.Initializing);

  const modelNodes = useAppSelector(state => selectModelNodes(state));
  const edgeNodes = useAppSelector(state => selectEdgeNodes(state));

  useEffect(() => {

    let tempStates: StatesObject = {}
    for (let modelNode of modelNodes) {
      for (let state of modelNode.data.model.system.states) {
        tempStates[`${modelNode.data.label}.${state}`] = ""
      }
    }

    setStates(tempStates)

    socket.onmessage = (message) => {
      console.log("Get message from server: ", message);
      if (message.data === "optimizing") {
        setEstimationStage(EstimationStage.Optimizing);
      } else if (message.data === "done") {
        setEstimationStage(EstimationStage.Done);
      } else {
        console.log("Got parameters!");
        let params: OptimizedParameter[] = JSON.parse(message.data);
        console.log("optimized parameters: ", params);
        setOptimizedParameters(JSON.parse(message.data));
        
      }
    };

  }, [socket]);

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

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {

    let tempStates: StatesObject = states;
    tempStates[(e.target as HTMLElement).id] = e.currentTarget.value;
    setStates(tempStates);
    console.log(tempStates);
  }

  const onEstimateButtonPressed = () => {
    showModal();
    let modelData = {modelNodes: modelNodes, edgeNodes: edgeNodes, states: states};
    console.log("sending model to server");
    console.log(modelData)
    send(socket, socketID, "estimate_parameters", modelData);
  }

  return (
    <div style={{margin: "24px", marginBottom: "10px"}}>
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

      <Title level={5}>Specify States</Title>
      <Collapse defaultActiveKey={[]} style={{marginBottom: "10px"}}>
        {modelNodes.map((modelNode) => {
          return (
          <Panel header={modelNode.data.label} key={modelNode.data.label}>
            {modelNode.data.model.system.states.map((state: string) => {
              return (
                <Input id={`${modelNode.data.label}.${state}`} onChange={onInputChange} addonBefore={state} key={`${modelNode.data.label}.${state}`} style={{margin: "10px"}}/>
              )
            })}
          </Panel>
          )
        })}
      </Collapse>
      <Form
        form={form}
        layout="vertical"
        // wrapperCol={{ span: 4 }}
      >
        <Button className="button" type="primary" onClick={onEstimateButtonPressed}>Estimate</Button>
        <Button className="button"icon={<CalendarOutlined />} onClick={showHistoryDrawer}>Parameter Estimation History</Button>
      </Form>

      <Modal 
        width="800px" 
        title="Parameter Estimation" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Ok"
        okButtonProps={{disabled: !(estimationStage === EstimationStage.Done)}}
      >
        <Steps current={estimationStage} style={{padding: "24px"}}>
          <Step title="Initializing Model"/>
          <Step title="Optimizing" />
          <Step title="Done"/>
        </Steps>
        {estimationStage === EstimationStage.Done &&
          <Table dataSource={optimizedParameters} columns={columns} pagination={false}/>
        }
      </Modal>
    </div>
  );
};