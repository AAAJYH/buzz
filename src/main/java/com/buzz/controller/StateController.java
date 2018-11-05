package com.buzz.controller;

import com.buzz.entity.State;
import com.buzz.service.StateService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * @Author: jyh
 * @Date: 2018/11/4 16:47
 * 状态控制层
 */

@Controller
@RequestMapping("/StateController")
public class StateController {

    @Resource
    StateService stateService;

    /**
     * 后台根据状态id查询状态对象
     * @param stateId
     * @return
     */
    @RequestMapping("/byStateIdQuery")
    @ResponseBody
    public State byStateIdQuery(String stateId){
        return stateService.byStateIdQuery(stateId);
    }

}
