package com.buzz.activiti;

import com.buzz.entity.Paging;
import com.buzz.entity.ProcessDefinitionInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/14 10:00
 */

@Controller
public class ActivitiController {

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    ProcessEngine processEngine;

    @Autowired
    ObjectMapper objectMapper;

    @RequestMapping("/aaa")
    public String aaa(){
        return "front_desk/1";
    }

    /**
     * 访问模型管理页面
     * @return
     */
    @RequestMapping("/modelManageIndex")
    public String modelManageIndex(){
        return "backstage_supporter/modelManage";
    }

    /**
     * 新建一个空模型
     */
    @RequestMapping("/create")
    @ResponseBody
    public void newModel(HttpServletResponse response) throws IOException {
        //初始化一个空模型
        Model model = repositoryService.newModel();

        //设置一些默认信息
        String name = "new-process";
        String description = "";
        int revision = 1;
        String key = "process";

        ObjectNode modelNode = objectMapper.createObjectNode();
        modelNode.put(ModelDataJsonConstants.MODEL_NAME, name);
        modelNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, description);
        modelNode.put(ModelDataJsonConstants.MODEL_REVISION, revision);

        model.setName(name);
        model.setKey(key);
        model.setMetaInfo(modelNode.toString());

        repositoryService.saveModel(model);
        String id = model.getId();

        //完善ModelEditorSource
        ObjectNode editorNode = objectMapper.createObjectNode();
        editorNode.put("id", "canvas");
        editorNode.put("resourceId", "canvas");
        ObjectNode stencilSetNode = objectMapper.createObjectNode();
        stencilSetNode.put("namespace",
                "http://b3mn.org/stencilset/bpmn2.0#");
        editorNode.put("stencilset", stencilSetNode);
        repositoryService.addModelEditorSource(id,editorNode.toString().getBytes("utf-8"));
        response.sendRedirect("/modeler.html?modelId="+id);
    }

    /**
     * 删除模型
     * @param id
     * @return
     */
    @RequestMapping("/byIdDelModel")
    @ResponseBody
    public String byIdDelModel(String id){
        repositoryService.deleteModel(id);
        return "ok";
    }

    /**
     * 修改模型
     * @param response
     * @param id
     */
    @GetMapping("/model/edit/{id}")
    public void edit(HttpServletResponse response, @PathVariable("id") String id) {
        System.out.println(id);
        try {
            response.sendRedirect("/modeler.html?modelId=" + id);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 分页查询所有模型
     */
    @RequestMapping("/modelList")
    @ResponseBody
    public Object modelList(Integer page,Integer rows){
        Integer total=repositoryService.createModelQuery().list().size(); //总记录数页数
        List<Model> modelList=repositoryService.createModelQuery().listPage((page-1)*rows,rows); //当前页数据
        return new Paging<Model>(modelList,total);
    }

    /**
     * 转换模型模型为流程定义
     */
    @RequestMapping("/deploy")
    @ResponseBody
    public Object deploy(String modelId) throws Exception {

        //获取模型
        Model modelData = repositoryService.getModel(modelId);
        byte[] bytes = repositoryService.getModelEditorSource(modelData.getId());

        if (bytes == null) {
            return "模型数据为空，请先设计流程并成功保存，再进行发布。";
        }

        JsonNode modelNode = new ObjectMapper().readTree(bytes);

        BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
        if(model.getProcesses().size()==0){
            return "数据模型不符要求，请至少设计一条主线流程。";
        }
        byte[] bpmnBytes = new BpmnXMLConverter().convertToXML(model);

        //部署流程
        String processName = modelData.getName() + ".bpmn20.xml";
        Deployment deployment = repositoryService.createDeployment()
                .name(modelData.getName())
                .addString(processName, new String(bpmnBytes, "UTF-8"))
                .deploy();
        modelData.setDeploymentId(deployment.getId());
        repositoryService.saveModel(modelData);

        return "SUCCESS";
    }

    /**
     * 流程定义管理页面
     * @return
     */
    @RequestMapping("/processDefinitionManageIndex")
    public String processDefinitionIndex(){
        return "backstage_supporter/processDefinitionManage";
    }

    /**
     * 查询流程定义
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/processDefinitionList")
    @ResponseBody
    public Paging<ProcessDefinitionInfo> processDefinitionList(Integer page,Integer rows){
        //查询总记录数
        Integer total=repositoryService.createProcessDefinitionQuery().list().size();
        //查询当前页数据
        List<ProcessDefinitionInfo> processDefinitionInfoList=new ArrayList<ProcessDefinitionInfo>();
        List<ProcessDefinition> processDefinitionList = repositoryService.createProcessDefinitionQuery().listPage((page-1)*rows,rows);
        //将对象转成实体
        for (ProcessDefinition processDefinition:processDefinitionList) {
            processDefinitionInfoList.add(new ProcessDefinitionInfo(processDefinition));
        }
        return new Paging<ProcessDefinitionInfo>(processDefinitionInfoList,total);
    }

    /**
     * 查看xml或diagram
     * @param resultType
     * @param id
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/resource/read/{xml}/{id}")
    public void resourceRead(@PathVariable("xml") String resultType, @PathVariable("id") String id, HttpServletResponse response) throws Exception {
        //根据act_re_prodef的id查询deployment_id
        String deploymentId=repositoryService.createProcessDefinitionQuery().processDefinitionId(id).singleResult().getDeploymentId();
        // 根据流程部署ID和资源名称获取输入流
        InputStream inputStream=processEngine.getRepositoryService()
                .getResourceAsStream(deploymentId, resultType);
        //获得字节流，通过该字节流的write(byte[] bytes)可以向response缓冲区中写入字节，再由Tomcat服务器将字节内容组成Http响应返回给浏览器。
        byte[] b = new byte[1024];
        int len = -1;
        while ((len = inputStream.read(b, 0, 1024)) != -1) {
            response.getOutputStream().write(b, 0, len);
        }
    }

    /**
     * 删除部署流程
     * @param id
     * @return
     */
    @RequestMapping("/deleteProcessDeployment")
    @ResponseBody
    public String deleteProcessDeployment(String id){
        //根据act_re_prodef的id查询act_re_deployment的id
        String deployment_id=repositoryService.createProcessDefinitionQuery().processDefinitionId(id).singleResult().getDeploymentId();
        //根据act_re_deployment的id删除部署流程，以及所有级联数据
        repositoryService.deleteDeployment(deployment_id,true);
        return "SUCCESS";
    }

    /**
     *  启动流程
     */
    @RequestMapping("/start")
    @ResponseBody
    public Object startProcess(String keyName) {
        ProcessInstance process = processEngine.getRuntimeService().startProcessInstanceByKey(keyName);
        return process.getId() + " : " + process.getProcessDefinitionId();
    }

    /**
     *  提交任务
     */
    @RequestMapping("/run")
    @ResponseBody
    public Object run(String processInstanceId) {
        Task task = processEngine.getTaskService().createTaskQuery().processInstanceId(processInstanceId).singleResult();
        processEngine.getTaskService().complete(task.getId());
        return "SUCCESS";
    }

}