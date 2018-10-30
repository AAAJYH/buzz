package com.buzz.entity;

import lombok.Data;
import org.activiti.engine.repository.ProcessDefinition;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/19 8:18
 */

@Data
public class ProcessDefinitionInfo {

    public ProcessDefinitionInfo(ProcessDefinition processDefinition){
        setId(processDefinition.getId());
        setDeployment_id(processDefinition.getDeploymentId());
        setName(processDefinition.getName());
        setResource(processDefinition.getResourceName());
        setDiagram(processDefinition.getDiagramResourceName());
    }

    private String id; //id
    private String deployment_id; //部署id
    private String name; //名称
    private String resource; //.xml文件
    private String diagram; //流程图

}
