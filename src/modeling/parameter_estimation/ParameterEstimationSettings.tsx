import React, { useState, useRef, useEffect } from 'react';
import { send } from '../../sockets/sockets'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { selectModelNodes, selectEdgeNodes } from '../graph_editor/graphEditorSlice'
import { v4 as uuidv4 } from 'uuid';
import { 
  FlowElement,
} from 'react-flow-renderer/nocss';

import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Steps, 
  Modal,
  Drawer,
  Tree,
  Typography,
  Collapse,
} from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';

import './ParameterEstimationSettings.less';
const { Title } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

enum EstimationStage {
  Initializing = 0,
  Optimizing,
  Done
}
export const ParameterEstimationSettings = () => {

  interface StatesObject {
    [key: string]: any
  }

  
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([])
  const [states, setStates] = useState<StatesObject>({})
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [estimationStage, setEstimationStage] = useState<EstimationStage>(EstimationStage.Initializing)

  const dispatch = useAppDispatch();
  const modelNodes = useAppSelector(state => selectModelNodes(state));
  const edgeNodes = useAppSelector(state => selectEdgeNodes(state));
  const socket = useRef(new WebSocket("ws://127.0.0.1:8081"));
  const socketID = useRef(uuidv4());
  
  useEffect(() => {

    let tempStates: StatesObject = {}
    for (let modelNode of modelNodes) {
      for (let state of modelNode.data.model.system.states) {
        tempStates[`${modelNode.data.label}.${state}`] = ""
      }
    }

    setStates(tempStates)

    socket.current.onopen = () => {
      console.log('Connected to websocket server');
      send(socket.current, socketID.current, "connect");
      setIsSocketConnected(true);
    };


    socket.current.onmessage = (message) => {
      console.log("Get message from server: ", message);
      if (message.data === "optimizing") {
        setEstimationStage(EstimationStage.Optimizing);
      } else if (message.data === "done") {
        setEstimationStage(EstimationStage.Done);
      } else {
        console.log("Got parameters!");
        console.log("optimized parameters: ", message.data);
        
      }
    };

    let s = socket.current;
    let id = socketID.current
    return () => {
      console.log("closing websocket connection");
      send(s, id, "disconnect");
      s.close();
    }

  }, []);

  const getParameterCategories = (modelNodes: FlowElement[]) => {
    let categories: string[] = []
    for (let modelNode of modelNodes) {
      categories.push(modelNode.data.label)
    }

    return categories
  }

  interface ParameterTreeItem {
    title: string;
    key: string;
    children: ParameterTreeItem[]
  }

  const getParametersTree = (modelNodes: FlowElement[]) => {

    let categories = getParameterCategories(modelNodes);
    let tree: ParameterTreeItem[] = [];
    for (let category of categories) {
      let parametersTree: ParameterTreeItem = {title: category, key: category, children: []}
      for (let modelNode of modelNodes) {
        let elementName = modelNode.data.label;
        if (elementName === category) {
          for (let parameter of modelNode.data.model.system.parameters) {
            let childTree: ParameterTreeItem = {title: parameter.name, key: `${elementName}.${parameter.name}`, children: []}
            parametersTree.children.push(childTree)
          }
        }
      }
      tree.push(parametersTree);
    }

    return tree;
  }

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

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }, info: any) => {
    console.log('onCheck');
    let temp = [];
    for (let checkedNode of info.checkedNodes) {
      if (checkedNode.key.includes(".")) {
        // if it includes a dot then its a element.paramtername type thing
        // and not a root folder (just a element name)
        temp.push(checkedNode.key);
      }
    }
    console.log("Selected parameters: ");
    console.log(temp);
    setSelectedParameters(temp);
  };

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {

    let tempStates: StatesObject = states;
    tempStates[(e.target as HTMLElement).id] = e.currentTarget.value;
    setStates(tempStates);
    console.log(tempStates);
  }

  const onEstimateButtonPressed = () => {
    showModal();
    let modelData = {modelNodes: modelNodes, edgeNodes: edgeNodes, selectedParameters: selectedParameters, states: states};
    console.log("sending model to server");
    console.log(modelData)
    send(socket.current, socketID.current, "estimate_parameters", modelData);
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
      <Title level={5}>Select Parameters</Title>
      <Tree
          checkable
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={getParametersTree(modelNodes)}
      />
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
        okText="Apply parameters to model"
        okButtonProps={{disabled: true}}
      >
        <Steps current={estimationStage} style={{padding: "24px"}}>
          <Step title="Initializing Model"/>
          <Step title="Optimizing" />
          <Step title="Done"/>
        </Steps>
      </Modal>
    </div>
  );
};