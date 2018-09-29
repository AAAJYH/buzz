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

    //游记页面
    @RequestMapping("/TravelNotes")
    public String TravelNotesIndex(){
        return "TravelNotes";
    }

       //攻略页面
    @RequestMapping("/Strategy")
    public String StrategyIndex(){
        return "Strategy";
    }

    //酒店页面
    @RequestMapping("/Hotel")
    public String HotelIndex(){
        return "Hotel";
    }

    @RequestMapping("/test")
    public String test(){
        return "test";
    }


}
