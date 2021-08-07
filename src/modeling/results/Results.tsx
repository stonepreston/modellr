import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { ResultItem, selectResults } from '../results/resultsSlice'
import { 
  Button, 
  Drawer,
  Tree,
  Typography
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

const { Title } = Typography;
export const Results = () => {

  const [settingsDrawerClosed, setSettingsDrawerClosed] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ResultItem[]>([]);

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

  const formatResultsForChecklist = (results: ResultItem[]):ResultItem[] => {
    let dots = removePlusSigns(results);
    let tees = removeTs(dots);
    return tees;
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

    let formattedResults = formatResultsForChecklist(results);
    let categories = getResultCategories(formattedResults);
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
    let temp = []
    for (let checkedNode of info.checkedNodes) {
      for (let resultItem of results) {
        if (checkedNode.key == resultItem.name) {
          temp.push(resultItem);
        }
      }
    }
    setChartData(temp);
  };

  let results: ResultItem[] = JSON.parse(JSON.stringify(useAppSelector(state => selectResults(state))));
  console.log("results: ", results);

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
          treeData={getResultTree(results)}
        />
      </Drawer>

      <Link to="/simulation">
        <Button icon={<LeftOutlined />}/>
      </Link>
      <Button icon={<SettingOutlined />} onClick={showSettingsDrawer} style={{float: "right"}}/>
      <div className="chart">
        {(chartData.length !== 0) &&
        <ResponsiveContainer width="70%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
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
            <Bar dataKey="value" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      }
      {chartData.length === 0 &&
        <Title level={3}>Press <SettingOutlined /> to add some data!</Title>
      }
      </div>
    </div>
  );
}