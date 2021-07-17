import React, { FC } from 'react';
import ReactFlow from 'react-flow-renderer/nocss';
import { 
  Drawer,
  Button
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';

// you need these styles for React Flow to work properly
import 'react-flow-renderer/dist/style.css';
// import 'react-flow-renderer/dist/theme-default.css';
import './GraphEditor.less';
import { 
  Controls, 
  MiniMap, 
  Background, 
  BackgroundVariant
} from 'react-flow-renderer/nocss';

import StepEdge from 'react-flow-renderer/nocss'

const elements = [
  {
    id: '1',
    type: 'input', // input node
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output', // output node
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'step'},
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'step'},
];


const edgeTypes = {
  default: StepEdge,
  step: StepEdge
};


export const GraphEditor: FC = () => {

  const [drawerCollapsed, setDrawerCollapsed] = React.useState<boolean>(true);
  const showDrawer = () => {
    setDrawerCollapsed(false);
  };
  const onClose = () => {
    setDrawerCollapsed(true);
  };

  return (
    <ReactFlow snapToGrid={true} elements={elements}>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={!drawerCollapsed}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Button className="add_button" onClick={showDrawer} type="primary" icon={<PlusOutlined />}/>
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

