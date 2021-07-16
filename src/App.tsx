import React, { FC } from 'react';
import './App.less';
import { Layout, Menu, Tree,  Row, PageHeader } from 'antd';
import {
  SettingOutlined,
  DownOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { GraphEditor } from './modeling/GraphEditor'
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const { DirectoryTree } = Tree;

type LogoProps = {
  isCollapsed: boolean
}

export const Logo = ({ isCollapsed }: LogoProps) => {
  if (isCollapsed) {
    return <BranchesOutlined className="logo_text"/>
  } else {
    return <h1 className="logo_text">Modellr</h1>
  }
}

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

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  function onCollapse() {
    setCollapsed(!collapsed)
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible width={300} collapsedWidth={0} collapsed={collapsed} onCollapse={onCollapse}>
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
          <Header style={{ padding: 0 }}>
            <h1 className="page_header_style">Simple Pipes</h1>
            <Menu mode="horizontal">
              <Menu.Item key="model" >
                Model
              </Menu.Item>
              <Menu.Item key="simulation">
                Simulation
              </Menu.Item>
              <Menu.Item key="parameter_estimation">
                Parameter Estimation
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div className="flow" >
              <GraphEditor />
            </div>
          </Content>
        </Layout>
      </Layout>
  );
}

export default App;
