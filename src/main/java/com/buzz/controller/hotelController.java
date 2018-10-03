package com.buzz.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/29 10:04
 * 酒店控制层
 */

@Controller
@RequestMapping("/hotelController")
public class hotelController {


    //酒店页面
    @RequestMapping("/hotelIndex")
    public String hotelIndex(){
        return "front_desk/Hotel";
    }

}
