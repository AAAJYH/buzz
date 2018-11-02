package com.buzz.controller;

import com.buzz.entity.Paging;
import com.buzz.entity.TaskInfoEntity;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricTaskInstanceQuery;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/11 9:08
 */

@Controller
public class ActivitiContorller {

    @Resource
    RepositoryService repositoryService;

    @Resource
    RuntimeService runtimeService;

    @Resource
    TaskService taskService;

    @Resource
    HistoryService historyService;

    /**
     * 跳转AskForLeaveManage.jsp页面
     * @return
     */
    @RequestMapping("/AskForLeaveManageIndex")
    public String AskForLeaveManageIndex(){
        return "/backstage_supporter/AskForLeaveManage";
    }

    /**
     * 根据员act_hi_taskinst的assignee(代理人)（查询历史任务，历史任务包括已经执行和正在执行的任务）
     * 1.先获取当前登录用户的员工名
     * 2.根据代理人分页查询历史任务
     * 3.将HistoricTaskInstance对象转换成实体对象，并获取每次任务的流程变量来设置实体的扩展属性
     * @return
     */
    @RequestMapping("/byAssigneeQueryTask")
    @ResponseBody
    public Paging<TaskInfoEntity> byAssigneeQueryTask(Integer page, Integer rows){
        //获取当前登录的用户名，并根据的用户名获取到员工姓名，作为任务代理人
//        String AdminName=(String) SecurityUtils.getSubject().getPrincipal();

        //根据历史服务接口，创建历史任务查询对象
        HistoricTaskInstanceQuery historicTaskInstanceQuery=historyService.createHistoricTaskInstanceQuery();
        //查询total和rows
        Integer total=historicTaskInstanceQuery.taskAssignee("张三")//设置查询条件，代理人
                                                .list().size(); //全部页
        List<HistoricTaskInstance> historicTaskInstances=historicTaskInstanceQuery.orderByHistoricTaskInstanceStartTime().desc().taskAssignee("张三")//设置查询条件，代理人
                                                                             .listPage((page-1)*rows,rows); //分页查询，查询从第几页都自己页
        //将List<HistoricTaskInstance>转换成List<TaskInfoEntity>实体类型
        List<TaskInfoEntity> lists=new ArrayList<TaskInfoEntity>();
        for (HistoricTaskInstance historicTaskInstance:historicTaskInstances) {
            //根据历史任务实例的executionId查询流程变量，然后对实体拓展的属性复制
            Map<String,Object> map=runtimeService.getVariables(historicTaskInstance.getExecutionId());
                lists.add(new TaskInfoEntity(historicTaskInstance,map));
        }
        return new Paging<TaskInfoEntity>(lists,total);
    }

    /**
     * 我要请假
     * 1.部署流程
     * 2.启动流程，并设置流程变量，指定第一个任务的代理人（assignee）
     * 3.设置第一个任务的流程变量作为扩展属性
     * @return
     */
    @RequestMapping("/StartProcess")
    @ResponseBody
    public String StartProcess(String days,String reason){

        String employee="张三";

        //部署流程并获取Deployment对象
        Deployment deployment=repositoryService.createDeployment() //创建Deployment对象
                .addClasspathResource("processes/AskForLeave.bpmn") //添加资源文件
                .addClasspathResource("processes/AskForLeave.png")
                .name("请假流程") //设置流程名称
                .deploy(); //部署流程方法


        //获取流程定义对象
        ProcessDefinition processDefinition=repositoryService.createProcessDefinitionQuery() //根据仓库服务对象，创建流程定义查询
                                                            .deploymentId(deployment.getId()) //设置查询条件，根据act_re_deployment的id查询
                                                            .singleResult(); //执行查询方法
        //定义流程变量
        Map<String,Object> variables=new HashMap<String, Object>();
        variables.put("employee",employee);
        variables.put("days",days);
        variables.put("reason",reason);
        variables.put("state","0");

        //根据act_re_procdef的id启动流程，并设置任务代理人
        ProcessInstance processInstance=runtimeService.startProcessInstanceById(processDefinition.getId(),variables);

        //根据ProcessInstance的id和任务的代理人查询act_ru_task对象
        Task task=taskService.createTaskQuery() //根据任务服务接口，创建任务
                .processInstanceId(processInstance.getId()) //设置流程实例Id
                .taskAssignee(employee) //设置任务代理人
                .singleResult();

        //通过act_ru_task的id设置此流程的流程变量
        taskService.setVariables(task.getId(),variables);

        return processInstance.getId();
    }

    @RequestMapping("/ToDoTheTransactionIndex")
    public String ToDoTheTransactionIndex(){
        return "backstage_supporter/ToDoTheTransaction";
    }

    /**
     * 分页查询当前正在执行的任务
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/pagingQueryRuntimeTask")
    @ResponseBody
    public Paging<TaskInfoEntity> pagingQueryRuntimeTask(Integer page, Integer rows){

        //查询act_ru_task表中正在运行任务的数量
        Integer total=taskService.createTaskQuery().list().size();

        //查询act_ru_task表中正在运行任务的数据
        List<TaskInfoEntity> TaskInfos=new ArrayList<TaskInfoEntity>();
        List<Task> tasks=taskService.createTaskQuery().orderByTaskCreateTime().desc().listPage((page-1)*rows,rows);
        //将List<Task>转换成List<TaskInfoEntity>实体类型，方便在页面显示
        for (Task task:tasks) {
            //根据act_ru_task的id查询流程变量，并对拓展属性进行复制
            Map<String,Object> map=taskService.getVariables(task.getId());
            TaskInfos.add(new TaskInfoEntity(task,map));
        }

        return new Paging<>(TaskInfos,total);
    }

    /**
     * 根据act_ru_task的id完成任务
     * @param id
     * @param reject
     * @return
     */
    @RequestMapping("/ByTaskIdcompleteTask")
    @ResponseBody
    public String ByTaskIdcompleteTask(String id,String reject){
        System.out.println(reject);
        //重新设置流程变量中 reject(驳回原因)和state(审核状态)和流程代理人
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("reject",reject);
        if(reject.equals("")){
            map.put("state","1"); //批准
        }else{
            map.put("state","2"); //驳回
        }
        map.put("admin","姬雨航");

        //根据act_ru_task的id设置流程变量
        taskService.setVariables(id,map);

        //执行任务
        taskService.complete(id,map);

        return "";
    }

    /**
     * 根据act_re_deployment的id删除部署流程
     * @param id
     * @return
     */
    @RequestMapping("/byIdDelDeployment")
    @ResponseBody
    public boolean byIdDelDeployment(String id){
        repositoryService.deleteDeployment(id,true);
        return true;
    }

}
