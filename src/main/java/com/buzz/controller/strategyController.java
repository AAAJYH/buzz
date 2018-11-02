package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.strategy;
import com.buzz.service.strategyService;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 20:25
 * 攻略 控制层
 */

@Controller
@RequestMapping("/strategyController")
public class strategyController {

    @Resource
    strategyService strategyService;

    /**
     * 查询城市攻略
     * ServletContext 获取city对象
     * @param model strategy对象
     * @return Strategy页面
     */
    @RequestMapping("/queryCityStrategy")
    public String queryCityStrategy(Model model, HttpServletRequest request){
        city city=(city) request.getServletContext().getAttribute("city");
        strategy strategy=strategyService.queryCityStrategy(city.getCityId());
        model.addAttribute("strategy",strategy);
        return "/front_desk/Strategy";
    }

    /**
     * 下载次数加一
     * @param strategyId
     * @return
     */
    @RequestMapping("/updateCityStrategyDownloadNumber")
    @ResponseBody
    public int updateCityStrategyDownloadNumber(String strategyId){
        return strategyService.updateCityStrategyDownloadNumber(strategyId);
    }


}
