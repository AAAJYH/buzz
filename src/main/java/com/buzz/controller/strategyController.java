package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.strategy;
import com.buzz.service.strategyService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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
    public String queryCityStrategy(Model model, HttpServletRequest request,String strategyId){
        //保存当前城市对象
        city city=(city) request.getServletContext().getAttribute("city");
        List<strategy> strategyList=strategyService.queryCityStrategy(city.getCityId());
        if(strategyList.size()>0) {
            strategy strategy=null;
            //如果strategyId为空默认查询第一个攻略，不为空根据id查询对象
            if(strategyId.equals("")){
                strategy=strategyList.get(0);
            }else{
                strategy=strategyService.byStrategyIdQueryStrategy(strategyId);
            }
            //保存要看的攻略
            model.addAttribute("strategy",strategy);

            //保存其他的攻略
            List<strategy> OtherStrategy=strategyService.queryOhterStrategy(strategy.getStrategyId());
            model.addAttribute("otherStrategy",OtherStrategy);
        }else{
            model.addAttribute("strategy",null);
        }
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
