package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/29 10:04
 * 酒店控制层
 */

@Controller
@RequestMapping("/hotelController")
public class hotelController {

    @Resource
    scenicspotService scenicspotService;

    /**
     * 查看城市酒店
     * @param model 景点集合
     * @param request 获取ServletContext对象
     * @param scenicspotId 默认选中的id
     * @return 酒店页面
     */
    @RequestMapping("/hotelIndex")
    public String hotelIndex(Model model, HttpServletRequest request,String scenicspotId){
        //获取上下文city对象
        city city=(city) request.getServletContext().getAttribute("city");
        //保存景点集合
        List<scenicspot> scenicspotList=scenicspotService.byCityIdQueryScenicspot(city.getCityId());
        model.addAttribute("scenicspotList",scenicspotList);
        if(scenicspotList.size()>0){
            //默认选中第一个景点
            if (scenicspotId .equals("")) {
                scenicspotId=scenicspotList.get(0).getScenicSpotId();
            }
            scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(scenicspotId);
            model.addAttribute("scenicspot",scenicspot);
        }
        return "front_desk/Hotel";
    }

    //酒店详情页面
    @RequestMapping("/hotelDetailsIndex")
    public String hotelDetailsIndex(Model model,Integer hotelId){
        model.addAttribute("hid",hotelId);
        return "front_desk/HotelDetails";
    }

    /**
     *
     * @param hid 酒店id
     * @param beginTime 入住日期
     * @param endTime 离开日期
     * @param productName 含早/不含早
     * @param price 价格
     * @param roomName 房间名称
     * @param model
     * @return 订单页面
     */
    @RequestMapping("/hotelOrderIndex")
    public String hotelOrderIndex(String hid,String beginTime,String endTime,String productName,Double price,Model model,String roomName) throws ParseException {
        model.addAttribute("hid",hid);
        model.addAttribute("beginTime",beginTime);
        model.addAttribute("endTime",endTime);
        model.addAttribute("productName",productName);
        model.addAttribute("price",price);
        model.addAttribute("roomName",roomName);
        SimpleDateFormat sDateFormat=new SimpleDateFormat("yyyy/MM/dd"); //加上时间
        Date date1=sDateFormat.parse(beginTime);
        Date date2=sDateFormat.parse(endTime);
        int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
        model.addAttribute("days",days); //入住天数
        return "front_desk/Order";
    }

}
