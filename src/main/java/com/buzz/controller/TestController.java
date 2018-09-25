package com.buzz.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/25 19:31
 */

@Controller
public class TestController {

    //景点页面
    @RequestMapping("/ScenicSpot")
    public String ScenicSpotIndex(){
        return "ScenicSpot";
    }

}
