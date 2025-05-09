const { EventEmitter } = require('node:events')
const elements = require('bpmn-elements')
const { Engine } = require('bpmn-engine')
const BpmnModdle = require('bpmn-moddle')
const Serializer = require('moddle-context-serializer')

async function getContext(source, options) {
  const moddleContext = await getModdleContext(source, options)

  if (moddleContext.warnings) {
    moddleContext.warnings.forEach(({ error, message, element, property }) => {
      if (error)
        return console.error(message)
      console.error(`<${element.id}> ${property}:`, message)
    })
  }

  const types = Serializer.TypeResolver({
    ...elements,
    ...options?.elements,
  })

  return Serializer(moddleContext, types, options?.extendFn)
}

function getModdleContext(source, options) {
  const bpmnModdle = new BpmnModdle(options)
  return bpmnModdle.fromXML(source)
}

async function main() {
  const engine = new Engine({
    name: 'first listener',
  })
  const source = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  id="sample-diagram"
  targetNamespace="http://bpmn.io/schema/bpmn"
  xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">

  <bpmn2:process id="Process_1" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:outgoing>Flow_0i8luz7</bpmn2:outgoing>
    </bpmn2:startEvent>

    <bpmn2:userTask id="Activity_07k9mfx" name="发起申请">
      <bpmn2:incoming>Flow_0i8luz7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0fga785</bpmn2:outgoing>
    </bpmn2:userTask>

    <bpmn2:userTask id="Activity_0dg8536" name="直属领导审批">
      <bpmn2:extensionElements>
        <camunda:properties>
          <camunda:property name="approvalType" value="1" />
          <camunda:property name="approverRole" value="leader" />
          <camunda:property name="approverDepartment" />
          <camunda:property name="rejectType" value="1" />
        </camunda:properties>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_0fga785</bpmn2:incoming>
      <bpmn2:outgoing>Flow_00jozw3</bpmn2:outgoing>
    </bpmn2:userTask>

    <bpmn2:userTask id="Activity_0kzc1iu" name="部门领导审批">
      <bpmn2:extensionElements>
        <camunda:properties>
          <camunda:property name="approvalType" value="1" />
          <camunda:property name="approverRole" value="department" />
          <camunda:property name="approverDepartment" value="2" />
          <camunda:property name="rejectType" value="1" />
        </camunda:properties>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_00jozw3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0e0zu1w</bpmn2:outgoing>
    </bpmn2:userTask>

    <bpmn2:endEvent id="Event_0fo9b47">
      <bpmn2:incoming>Flow_0e0zu1w</bpmn2:incoming>
    </bpmn2:endEvent>

    <bpmn2:sequenceFlow id="Flow_0i8luz7" sourceRef="StartEvent_1" targetRef="Activity_07k9mfx" />
    <bpmn2:sequenceFlow id="Flow_0fga785" sourceRef="Activity_07k9mfx" targetRef="Activity_0dg8536" />
    <bpmn2:sequenceFlow id="Flow_00jozw3" sourceRef="Activity_0dg8536" targetRef="Activity_0kzc1iu" />
    <bpmn2:sequenceFlow id="Flow_0e0zu1w" sourceRef="Activity_0kzc1iu" targetRef="Event_0fo9b47" />
  </bpmn2:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="92" y="292" width="36" height="36" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Activity_07k9mfx_di" bpmnElement="Activity_07k9mfx">
        <dc:Bounds x="170" y="270" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Activity_0dg8536_di" bpmnElement="Activity_0dg8536">
        <dc:Bounds x="340" y="270" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Activity_0kzc1iu_di" bpmnElement="Activity_0kzc1iu">
        <dc:Bounds x="340" y="430" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Event_0fo9b47_di" bpmnElement="Event_0fo9b47">
        <dc:Bounds x="142" y="452" width="36" height="36" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNEdge id="Flow_0i8luz7_di" bpmnElement="Flow_0i8luz7">
        <di:waypoint x="128" y="310" />
        <di:waypoint x="170" y="310" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_0fga785_di" bpmnElement="Flow_0fga785">
        <di:waypoint x="270" y="310" />
        <di:waypoint x="340" y="310" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_00jozw3_di" bpmnElement="Flow_00jozw3">
        <di:waypoint x="390" y="350" />
        <di:waypoint x="390" y="430" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_0e0zu1w_di" bpmnElement="Flow_0e0zu1w">
        <di:waypoint x="340" y="470" />
        <di:waypoint x="178" y="470" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`

  const sourceContext = await getContext(source)
  engine.addSource({
    sourceContext,
  })

  const listener = new EventEmitter()
  listener.on('activity.enter', (elementApi, engineApi) => {
    console.log(`${elementApi.type} <${elementApi.id}> in ${elementApi.name} of ${engineApi.name} is entered`)

    // 获取节点的扩展属性
    const element = elementApi.broker.getState().element
    if (element && element.extensionElements) {
      const properties = element.extensionElements.values.find(el => el.$type === 'camunda:Properties')
      if (properties) {
        console.log('节点属性配置-enter:')
      }
    }
  })

  listener.on('activity.wait', (elementApi, instance) => {
    console.log(`${elementApi.type} <${elementApi.id}> in ${elementApi.name} of ${instance.name} is waiting for input`)

    // 获取等待节点的扩展属性
    // 获取节点的扩展属性
    const element = elementApi.broker.getState().element
    if (element && element.extensionElements) {
      const properties = element.extensionElements.values.find(el => el.$type === 'camunda:Properties')
      if (properties) {
        console.log('节点属性配置-wait:')
      }
    }

    // elementApi.signal('approve')
  })

  const executeObj = await engine.execute({
    variables: {
      approvalType: 1,
      approverRole: 'leader',
      approverDepartment: '2',
      rejectType: 1,
    },
    listener,
  })

  console.log(executeObj)
}

main()
