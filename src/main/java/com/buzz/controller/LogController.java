package com.buzz.controller;

import com.buzz.entity.Log;
import com.buzz.entity.Paging;
import com.buzz.service.LogService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * @Author: jyh
 * @Date: 2018/11/11 20:45
 * 日志记录管理层
 */

@Controller
@RequestMapping("/LogController")
public class LogController {

    @Resource
    LogService logService;

    @RequestMapping("/LogManageIndex")
    public String LogManageIndex(){
        return "backstage_supporter/logManage";
    }

    /**
     * 后台分页查询日志
     */
    @RequestMapping("/queryAll")
    @ResponseBody
    public Paging<Log> queryAll(Integer page, Integer rows){
        return logService.queryAll(page,rows);
    }

}
