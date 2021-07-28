import  { useState, useEffect, useRef } from 'react';
import ReactFlow from 'react-flow-renderer/nocss';
import { ModelCategory, Model } from "../../types/index";
import CSApi from "../API/CSApi"
import { ParameterForm } from './ParameterForm'
import { setElements, setTransform } from './graphEditorSlice'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { 
  Drawer,
  Button,
  Collapse,
  Modal,
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
  useStoreState,
  FlowTransform,
  Transform,
  useZoomPanHelper
} from 'react-flow-renderer/nocss';

const { Panel } = Collapse;

const edgeTypes: EdgeTypesType = {
  default: StepEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge
};

// const initialElements: Elements = [];
export const GraphEditor = () => {

  const dispatch = useAppDispatch();
  const elements = useAppSelector(state => state.graphEditor.elements)
  const transformState = useAppSelector(state => state.graphEditor.transform)
  const [nodeModalVisible, setNodeModalVisible] = useState<boolean>(false);
  const [elementsDrawerClosed, setElementsDrawerClosed] = useState<boolean>(true);
  const [historyDrawerClosed, setHistoryDrawerClosed] = useState<boolean>(true);
  const [modelCategories, setModelCategories] = useState<Array<ModelCategory> | undefined>([])
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();
  const storeTransform: Transform = useStoreState((store) => store.transform);
  const storeTransformRef = useRef(storeTransform);

  const { transform } = useZoomPanHelper();

  // sets the initial transform based on state
  // its also necessary to set the default position prop
  // of the react flow component
  const onLoad = (reactFlowInstance: any) => {
    transform(transformState);
  };

  useEffect(() => {    
    CSApi.get('/categorized_models' )
      .then(response => {
        setModelCategories(response.data);
      })
      .catch(error => {
        console.log(`Error fetching categorized models: ${error}`)
      });

  }, []);

  // this is used to grab the current transform from the internal
  // react flow store whenever it changes
  useEffect(() => {   
      storeTransformRef.current = storeTransform;
  }, [storeTransform]);

  // runs when the component unmounts
  // updates the (non-react-flow) redux store with the final transform
  useEffect(() => {   
    return () => {
      console.log("setting new state before leaving");
      let newTransform: FlowTransform = {x: storeTransformRef.current[0], 
                                         y: storeTransformRef.current[1], 
                                         zoom: storeTransformRef.current[2]}
      dispatch(setTransform(newTransform));
    } 
  }, [dispatch]);


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

  const onNodeDoubleClick = (event: any, node: Node) => {
    setSelectedNode(node);
    setNodeModalVisible(true);
  };

  const addNode = (model: Model) => {

    var nodeType = "default"
    if (model.system.connections.length === 1) {
      nodeType = "input"
    }

    const newNode: Node = {
      id: getNodeId(),
      type: nodeType,
      data: { label: model.name, model: model},
      position: {
        x: window.innerWidth / 2.7,
        y: window.innerHeight / 2.7,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    dispatch(setElements(elements.concat(newNode)));

  }

  const onAddElement = (model: Model) => {
    addNode(model);
  };

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
      onLoad={onLoad}
      defaultPosition={[transformState.x, transformState.y]}
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
          onCancel={() => {setNodeModalVisible(false);}}
          destroyOnClose={true}
        >
          {selectedNode && 
            <ParameterForm selectedNode={selectedNode} elements={elements} setElements={
              (els: Elements) => {dispatch(setElements(els))}
            } />
          }
      </Modal>
    </ReactFlow>
  );
}

