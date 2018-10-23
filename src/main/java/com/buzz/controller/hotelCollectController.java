package com.buzz.controller;

import com.buzz.entity.hotelCollect;
import com.buzz.entity.users;
import com.buzz.service.hotelCollectService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.UUID;

/**
 * @Author: jyh
 * @Date: 2018/10/17 21:56
 * 酒店收藏控制层
 */

@Controller
@RequestMapping("/hotelCollectController")
public class hotelCollectController {

    @Resource
    hotelCollectService hotelCollectService;

    /**
     * 用户收藏酒店
     * @param hotelId 酒店Id
     * @param session 获取用户id
     * @return 添加结果
     */
    @RequestMapping("/addHotelCollect")
    @ResponseBody
    public int addHotelCollect(String hotelId, HttpSession session){
        String hotelCollectId= UUID.randomUUID().toString();
        String userId=((users)session.getAttribute("user")).getUserId();
        return hotelCollectService.addHotelCollect(hotelCollectId,userId,hotelId);
    }

}
