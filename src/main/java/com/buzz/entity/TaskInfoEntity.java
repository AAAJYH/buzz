package com.buzz.entity;

import lombok.Data;
import org.activiti.engine.task.TaskInfo;

import java.util.Date;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/11 20:22
 */

/**
 * Task对象和HistoricTaskInstance都集成TaskInfo
 */
@Data
public class TaskInfoEntity {

    public TaskInfoEntity(TaskInfo taskInfo, Map<String,Object> variables){
        this.setId(taskInfo.getId());
        this.setName(taskInfo.getName());
        this.setDescription(taskInfo.getDescription());
        this.setAssignee(taskInfo.getAssignee());
        this.setCreatetime(taskInfo.getCreateTime());
        this.setDays((String) variables.get("days"));
        this.setReason((String) variables.get("reason"));
        this.setState((String) variables.get("state"));
        this.setReject((String) variables.get("reject"));
    }

    private String id;
    private String name;
    private String description;
    private String assignee;
    private Date createtime;

    //对表进行扩展
    private String days; //请假天数
    private String reason; //请假原因
    private String state; //状态 0 1
    private String reject; //驳回原因

}
