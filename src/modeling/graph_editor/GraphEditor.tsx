import React, { useState, useCallback } from 'react';
import ReactFlow from 'react-flow-renderer/nocss';
import { 
  Drawer,
  Button,
  Collapse
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
  ConnectionLineType
} from 'react-flow-renderer/nocss';

const { Panel } = Collapse;

const edgeTypes: EdgeTypesType = {
  default: StepEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge
}

const initialElements: Elements = []
export const GraphEditor = () => {

  const [elements, setElements] = useState<Elements>(initialElements);
  const [elementsDrawerClosed, setElementsDrawerClosed] = useState<boolean>(true);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);


  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (params: Edge | Connection) => 
    setElements((els) => addEdge(params, els));
  
  const getNodeId = () => `randomnode_${+new Date()}`;

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

  const onAddPipe = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Simple Pipe' },
      position: {
        x: window.innerWidth / 2.7,
        y: window.innerHeight / 2.7,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,

    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  const onAddSource = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Source' },
      type: 'input',
      position: {
        x: window.innerWidth / 2.7,
        y: window.innerHeight / 2.7,
      },
      sourcePosition: Position.Right,
    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  const onAddSink = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Sink' },
      type: 'output',
      position: {
        x: window.innerWidth / 2.7,
        y: window.innerHeight / 2.7,
      },
      targetPosition: Position.Left,
    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  return (
    <ReactFlow 
      snapToGrid={false} 
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      edgeTypes={edgeTypes}
      connectionLineType={ConnectionLineType.Step}
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
          <Panel header="Pipes" key="1">
            <Button onClick={onAddPipe}>Simple Pipe</Button>
          </Panel>
          <Panel header="Sources" key="2">
            <Button onClick={onAddSource}>Ideal Pressure Source</Button>
          </Panel>
          <Panel header="Sinks" key="3">
            <Button onClick={onAddSink}>Ideal Pressure Sink</Button>
          </Panel>
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
    </ReactFlow>
  );
}

