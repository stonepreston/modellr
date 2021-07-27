import { Parameter } from "../../types/index";
import { 
  Node,
  Elements
} from 'react-flow-renderer/nocss';

import { 
  Form, 
  Input
} from 'antd';

type ParameterFormProps = {
  selectedNode: Node,
  elements: Elements
  setElements: Function,
}

export const ParameterForm = ({ selectedNode, elements, setElements }: ParameterFormProps) => {

  const onParameterFormValuesChanged = (changedValues: any, allValues: any) => {
    let parameters: Parameter[] = [];
    let name: string = "";

    for (const [key, value] of Object.entries(allValues)) {
      if (key === "element_name") {
        name = value as string;
      } else {
        parameters.push({name: key, value: Number(value)})
      }
    }

    selectedNode.data = {...selectedNode.data, label: name, model: {
        ...selectedNode.data.model, system: {
          ...selectedNode.data.model.system, parameters: parameters
        }
      } 
    };

    setElements((els: Elements) =>
      els.map((e) => {
        if (e.id === selectedNode.id) {
          return {...e, data: {
                    ...selectedNode.data, labelmodel: {
                      ...selectedNode.data.model, system: {
                        ...selectedNode.data.model.system, parameters: parameters
                }
              }
            } 
          };
        }
        return e;
      })
    );

  }

  const getInitialFieldValues = () => {
    let values: any = {}
    values['element_name'] = selectedNode.data.label;
    selectedNode.data.model.system.parameters.forEach((parameter: Parameter) => values[parameter.name] = parameter.value);
    return values;
  }

  return (
    <Form
      name={selectedNode.data.label}
      layout="horizontal"
      style={{margin: "24px"}}
      onValuesChange={onParameterFormValuesChanged} 
      initialValues={getInitialFieldValues()}
    >
      <Form.Item name="element_name" key="element_name" required label="Name">
        <Input />
      </Form.Item>
      {selectedNode.data.model.system.parameters.map((parameter: Parameter) => (
      <Form.Item name={parameter.name} key={parameter.name} required label={parameter.name}>
        <Input />
      </Form.Item>
      ))}
    </Form>
  );

}