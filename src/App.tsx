import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.less';
import { 
  Layout, 
  Menu, 
  Tree, 
} from 'antd';
import {
  SettingOutlined,
  BranchesOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { GraphEditor } from './modeling/graph_editor/GraphEditor'
import { SimulationSettings } from './modeling/simulation/SimulationSettings'
import { ParameterEstimationSettings } from './modeling/parameter_estimation/ParameterEstimationSettings'
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const { DirectoryTree } = Tree;

const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];

const App: FC = () => {

  const [siderCollapsed, setSiderCollapsed] = React.useState<boolean>(false);

  function toggleSider() {
    setSiderCollapsed(!siderCollapsed)
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible width={300} collapsedWidth={0} collapsed={siderCollapsed} trigger={null}>
            <div className="logo">
              <div className="logo_text">Modellr</div>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <SubMenu key="sub1" icon={<BranchesOutlined />} title="Models">
              <DirectoryTree
                multiple
                defaultExpandAll
                treeData={treeData}
              />
              </SubMenu>
              <Menu.Item key="9" icon={<SettingOutlined />}>
                Settings
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="nav_header">
              {React.createElement(siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggleSider
              })}

              <Menu mode="horizontal" style={{float: "left"}}>
                <Menu.Item key="model">
                  <Link to="/graph_editor">Model</Link>
                </Menu.Item>
                <Menu.Item key="simulation">
                  <Link to="/simulation">Simulation</Link>
                </Menu.Item>
                <Menu.Item key="parameter_estimation">
                  <Link to="/parameter_estimation">Parameter Estimation</Link>
                </Menu.Item>
              </Menu>
              <h1 style={{float: "right", marginRight: "24px"}}>Simple Pipe Model</h1>
            </Header>
            <Content >
              <Switch>
                <Route path="/graph_editor">
                  <div className="flow" >
                    <GraphEditor/>
                  </div>
                </Route>
                <Route path="/simulation">
                  <SimulationSettings />
                </Route>
                <Route path="/parameter_estimation">
                  <ParameterEstimationSettings />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
  );
}

export default App;
