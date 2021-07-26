import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setElements } from './graphEditorSlice'
import ReactFlow from 'react-flow-renderer/nocss';
import { ModelCategory, Model, Parameter } from "../../types/index";
import CSApi from "../API/CSApi"

import { cloneDeep } from 'lodash';

import { 
  Drawer,
  Button,
  Collapse,
  Modal,
  Form, 
  Input, 
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined
} from '@ant-design/icons';

// you need these styles for React Flow to work properly
import 'react-flow-renderer/dist/style.css';
// import 'react-flow-renderer/dist/theme-default.css';
import './GraphEditor.less';
import { 
  Controls, 
  MiniMap, 
  Background, 
  BackgroundVariant,
  Position,
  Elements,
  removeElements,
  Connection,
  Edge,
  addEdge,
  EdgeTypesType,
  StepEdge,
  StraightEdge,
  SmoothStepEdge,
  ConnectionLineType,
  ConnectionMode,
  Node,
  FlowElement,
} from 'react-flow-renderer/nocss';

const { Panel } = Collapse;

const edgeTypes: EdgeTypesType = {
  default: StepEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge
}

export const GraphEditor = () => {

  const dispatch = useAppDispatch();
  const elements = useAppSelector(state => state.graphEditor.elements)
  const [nodeModalVisible, setNodeModalVisible] = useState<boolean>(false);
  const [elementsDrawerClosed, setElementsDrawerClosed] = useState<boolean>(true);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const [modelCategories, setModelCategories] = useState<Array<ModelCategory> | undefined>([])
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();

  const [form] = Form.useForm();

  useEffect(() => {    
    CSApi.get('/categorized_models' )
      .then(response => {
        setModelCategories(response.data);
      })
      .catch(error => {
        console.log(`Error fetching categorized models: ${error}`)
      });
  }, []);


  const onElementsRemove = (elementsToRemove: Elements) => {
    dispatch(setElements((removeElements(elementsToRemove, elements))));
  }
    

  const onConnect = (params: Edge | Connection) => {
    dispatch(setElements(addEdge(params, elements)));
  }
  
  const getNodeId = () => `node_${+new Date()}`;

  const showElementsDrawer = () => {
    setElementsDrawerClosed(false);
  };

  const onCloseElementsDrawer = () => {
    setElementsDrawerClosed(true)
  };

  const showHistoryDrawer = () => {
    setHistoryDrawerClosed(false);
  };

  const onCloseHistoryDrawer = () => {
    setHistoryDrawerClosed(true)
  };

  const onNodeDoubleClick = useCallback((event, node: Node) => {
    setSelectedNode(node);
    setNodeModalVisible(true);
    console.log(node);
  }, [setSelectedNode]);

  const addNode = (model: Model) => {

    var nodeType = "default"
    if (model.system.connections.length === 1) {
      nodeType = "input"
    }

    let m = cloneDeep(model);

    const newNode: Node = {
      id: getNodeId(),
      type: nodeType,
      data: { label: m.name, model: m},
      position: {
        x: window.innerWidth / 2.7,
        y: window.innerHeight / 2.7,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    dispatch(setElements(elements.concat(newNode)));
    
  };

  const onAddElement = (model: Model) => {
    addNode(model);
    console.log("new elements", elements);
  };

  const onParameterFormValuesChanged = (changedValues: any, allValues: any) => {
    let parameters: Parameter[] = []
    for (const [key, value] of Object.entries(allValues)) {
      parameters.push({name: key, value: Number(value)})
    }
    console.log(selectedNode!.data)
    selectedNode!.data = {...selectedNode!.data, model: {
        ...selectedNode!.data.model, system: {
          ...selectedNode!.data.model.system, parameters: parameters
        }
      } 
    };
  }

  return (
    <ReactFlow 
      snapToGrid={false} 
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      edgeTypes={edgeTypes}
      connectionLineType={ConnectionLineType.Step}
      connectionMode={ConnectionMode.Loose}
      onNodeDoubleClick={(event, node) => {onNodeDoubleClick(event, node);}}
    >
      <Drawer
        title="Elements"
        placement="right"
        closable={true}
        onClose={onCloseElementsDrawer}
        visible={!elementsDrawerClosed}
        getContainer={false}
        mask={false}
        width={500}
        headerStyle={{marginTop: "9px"}}
      >
        <Collapse defaultActiveKey={['1']} style={{ margin: '0px'}}>
          {modelCategories!.map(category => (
            <Panel header={category.category} key={category.category}>
              {category.models.map(model => (
                <Button key={model.id} onClick={() => onAddElement(model)}>{model.name}</Button>
              ))}
            </Panel>
          ))}
        </Collapse>
      </Drawer>
      <Drawer
        title="Model History"
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
      <Button className="add_button" onClick={showElementsDrawer} type="primary" icon={<PlusOutlined />}/>
      <Button className="history_button" onClick={showHistoryDrawer} type="primary" icon={< CalendarOutlined />}/>
      <MiniMap
          nodeColor={(node) => {
            return "white"
          }}
          nodeStrokeWidth={3}
          maskColor={"#1f1f1f"}
      />
      <Controls />
      <Background
          variant={BackgroundVariant.Dots}
      />
      <Modal
          title={selectedNode?.data.model.name}
          centered
          closable
          visible={nodeModalVisible}
          footer={null}
          onCancel={() => setNodeModalVisible(false)}
        >
          <div>
          <Form
            form={form}
            name={selectedNode?.data.label}
            layout="horizontal"
            style={{margin: "24px"}}
            onValuesChange={onParameterFormValuesChanged} 
            // wrapperCol={{ span: 4 }}
          >
            {selectedNode?.data.model.system.parameters.map((parameter: Parameter) => (
              <Form.Item initialValue={parameter.value} name={parameter.name} key={parameter.name} required label={parameter.name}>
                <Input />
              </Form.Item>
            ))}
          </Form>
          </div>
      </Modal>
    </ReactFlow>
  );
}

