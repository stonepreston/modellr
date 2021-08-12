import { Parameter, Argument } from "../../types/index";
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

    setElements(
      elements.map((e) => {
        if (e.id === selectedNode.id) {
          return {...e, data: {
                    ...selectedNode.data, model: {
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

  const onArgumentFormValuesChanged = (changedValues: any, allValues: any) => {
    let args: Argument[] = [];
    for (const [key, value] of Object.entries(allValues)) {
      args.push({name: key, value: Number(value)})
    }

    selectedNode.data = {...selectedNode.data, model: {
        ...selectedNode.data.model, system: {
          ...selectedNode.data.model.system, arguments: args
        }
      } 
    };

    setElements(
      elements.map((e) => {
        if (e.id === selectedNode.id) {
          return {...e, data: {
                    ...selectedNode.data, model: {
                      ...selectedNode.data.model, system: {
                        ...selectedNode.data.model.system, arguments: args
                }
              }
            } 
          };
        }
        return e;
      })
    );

  }

  const getInitialParameterFieldValues = () => {
    let values: any = {}
    values['element_name'] = selectedNode.data.label;
    selectedNode.data.model.system.parameters.forEach((parameter: Parameter) => values[parameter.name] = parameter.value);
    return values;
  }

  const getInitialArgumentFieldValues = () => {
    let values: any = {}
    values['element_name'] = selectedNode.data.label;
    selectedNode.data.model.system.arguments.forEach((argument: Argument) => values[argument.name] = argument.value);
    return values;
  }


  return (
    <div>
      <Form
        name={selectedNode.data.label}
        layout="horizontal"
        style={{margin: "12px"}}
        onValuesChange={onParameterFormValuesChanged} 
        initialValues={getInitialParameterFieldValues()}
      >
        <Form.Item name="element_name" key="element_name">
          <Input addonBefore="Name"/>
        </Form.Item>
        {selectedNode.data.model.system.parameters.length > 0 && 
          <h3>Parameters</h3>
        }
        {selectedNode.data.model.system.parameters.map((parameter: Parameter) => (
        <Form.Item name={parameter.name} key={parameter.name}>
          <Input addonBefore={parameter.name}/>
        </Form.Item>
        ))}
      </Form>

      <Form
        name={`${selectedNode.data.label}_Arguments`}
        layout="horizontal"
        style={{margin: "12px"}}
        onValuesChange={onArgumentFormValuesChanged} 
        initialValues={getInitialArgumentFieldValues()}
      >
        {selectedNode.data.model.system.arguments.length > 0 && 
          <h3>Arguments</h3>
        }
        {selectedNode.data.model.system.arguments.map((argument: Argument) => (
        <Form.Item name={argument.name} key={argument.name}>
          <Input addonBefore={argument.name}/>
        </Form.Item>
        ))}
      </Form>
    </div>
  );

}