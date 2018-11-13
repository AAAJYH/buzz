package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.strategy;
import com.buzz.service.cityService;
import com.buzz.service.strategyService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("cityController")
public class cityController
{
    @Resource
    private cityService cityservice;
    @Resource
    private strategyService strategyservice;
    /**
     * 根据城市名称查询城市
     * @param cityName
     * @return
     */
    @ResponseBody
    @RequestMapping("find_cityBykeyUp")
    public List<city> find_cityBykeyUp(String cityName)
    {
        return cityservice.byCityNameQuery(cityName);
    }

    /**
     * 查询城市的前几条数据
     * @return
     */
    @ResponseBody
    @RequestMapping("find_cityByLIMIT")
    public List<city> find_cityByLIMIT()
    {
        return cityservice.find_cityByLIMIT(8);
    }

    @ResponseBody
    @RequestMapping("find_cityHot1")
    public city find_cityHot1()
    {
        return cityservice.find_cityHot1();
    }

    /**
     * 根据城市名称查询城市,并且根据查询出城市id查询城市攻略
     * @param cityName
     * @return
     */
    @ResponseBody
    @RequestMapping("find_cityAndStrategyBykeyUp")
    public Map<String,Object> find_cityAndStrategyBykeyUp(String cityName)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<city> citys=cityservice.byCityNameQuery(cityName);
        List<strategy> strategys=new ArrayList<strategy>();
        if(null!=citys&&0<citys.size())
        {
            for(city c:citys)
            {
                List<strategy> list=strategyservice.find_strategyBycityId(c.getCityId());
                if(null!=list&&0<list.size())
                {
                    for(strategy s:list)
                    {
                        strategys.add(s);
                    }
                }
            }
        }
        map.put("citys",citys);
        map.put("strategys",strategys);
        return map;
    }

    /**
     * 查询每个城市有多少问答
     * @return
     */
    @ResponseBody
    @RequestMapping("find_city_askRespondNum")
    public List<city> find_city_askRespondNum()
    {
        return cityservice.find_city_askRespondNum("0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
    }
}
