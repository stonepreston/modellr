import React, { useEffect, useState, useRef } from 'react';
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
  Drawer,
  Tree
} from 'antd';

import {
  LeftOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Link
} from "react-router-dom";

import './Results.less';

interface ResultItem {
  name: string;
  value: number[];
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


export const Results = () => {

  const [settingsDrawerClosed, setSettingsDrawerClosed] = useState<boolean>(true);

  const showSettingsDrawer = () => {
    setSettingsDrawerClosed(false);
  };

  const onCloseSettingsDrawer = () => {
    setSettingsDrawerClosed(true)
  };

  const removePlusSigns = (results: ResultItem[]):ResultItem[] => {
    for (let item of results) {
      item.name = item.name.replaceAll("₊", ".");
    }

    return results
  }
  const removeTs = (results: ResultItem[]):ResultItem[] => {
    for (let item of results) {
      item.name = item.name.replaceAll("(t)", "");
    }

    return results
  }

  const getResultCategories = (results: ResultItem[]) => {

    results = removePlusSigns(results);
    results = removeTs(results);

    let categories: string[] = []
    for (let item of results) {
      categories.push(item.name.split(".")[0]);
    }

    return categories.filter((x, i, a) => a.indexOf(x) === i)
  }

  interface ResultTreeItem {
    title: string;
    key: string;
    children: ResultTreeItem[]
  }
  const getResultTree = (results: ResultItem[]) => {
    let categories = getResultCategories(results);
    let tree: ResultTreeItem[] = [];
    for (let category of categories) {
      let categoryTree: ResultTreeItem = {title: category, key: category, children: []}
      for (let item of results) {
        if (item.name.startsWith(category)) {
          let childTree: ResultTreeItem = {title: item.name, key: item.name, children: []}
          categoryTree.children.push(childTree)
        }
      }
      tree.push(categoryTree);
    }

    return tree;
  }

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }, info: any) => {
    console.log('onCheck', checked, info);
  };


  const results: ResultItem[] = JSON.parse("[{\"name\":\"ideal_pressure_source_1₊a₊Q(t)\",\"value\":-11.470217164799628},{\"name\":\"static_pipe_1₊a₊Q(t)\",\"value\":11.470217164799628},{\"name\":\"ideal_pressure_source_1₊a₊p(t)\",\"value\":501325.0},{\"name\":\"static_pipe_1₊a₊p(t)\",\"value\":501325.0},{\"name\":\"static_pipe_1₊b₊Q(t)\",\"value\":-11.470217164799628},{\"name\":\"static_pipe_2₊a₊Q(t)\",\"value\":11.470217164799628},{\"name\":\"static_pipe_1₊b₊p(t)\",\"value\":301325.0000000001},{\"name\":\"static_pipe_2₊a₊p(t)\",\"value\":301325.0000000001},{\"name\":\"static_pipe_2₊b₊Q(t)\",\"value\":-11.470217164799628},{\"name\":\"ideal_pressure_source_2₊a₊Q(t)\",\"value\":11.470217164799628},{\"name\":\"static_pipe_2₊b₊p(t)\",\"value\":101325.0},{\"name\":\"ideal_pressure_source_2₊a₊p(t)\",\"value\":101325.0},{\"name\":\"static_pipe_2₊Δp(t)\",\"value\":200000.0000000001},{\"name\":\"static_pipe_2₊Q(t)\",\"value\":11.470217164799628},{\"name\":\"static_pipe_1₊Δp(t)\",\"value\":199999.99999999988},{\"name\":\"static_pipe_1₊Q(t)\",\"value\":11.470217164799628}]");
  let dots = removePlusSigns(results);
  let tees = removeTs(dots);

  return (
    <div style={{margin: "24px"}}>
       <Drawer
        title="Plot Settings"
        placement="right"
        closable={true}
        onClose={onCloseSettingsDrawer}
        visible={!settingsDrawerClosed}
        getContainer={false}
        mask={false}
        width={500}
        headerStyle={{marginTop: "9px"}}
      >
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={getResultTree(tees)}
        />
      </Drawer>

      <Link to="/simulation">
        <Button icon={<LeftOutlined />}/>
      </Link>
      <Button icon={<SettingOutlined />} onClick={showSettingsDrawer} style={{float: "right"}}/>
      <div className="chart">
        <ResponsiveContainer width="70%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="white" />
            <XAxis dataKey="name" stroke="white"/>
            <YAxis stroke="white"/>
            <Bar dataKey="pv" fill="#1890ff" />
            <Bar dataKey="uv" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}