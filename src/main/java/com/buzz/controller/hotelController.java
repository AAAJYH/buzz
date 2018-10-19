package com.buzz.controller;

import com.buzz.entity.*;
import com.buzz.service.hotelCollectService;
import com.buzz.service.hotelOrdersService;
import com.buzz.service.scenicspotService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
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

    @Resource
    hotelCollectService hotelCollectService;

    @Resource
    hotelOrdersService hotelOrdersService;

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

    /**
     * 查看酒店详情
     * @param model state:存放当前酒店是否被当前用户收藏
     * @param hotelId 酒店id
     * @param session 用户获取当前登录的user
     * @return 酒店详情页面
     */
    @RequestMapping("/hotelDetailsIndex")
    public String hotelDetailsIndex(Model model, String hotelId, HttpSession session){
        model.addAttribute("hid",hotelId);
        if(session.getAttribute("user")!=null){
            users users= (users) session.getAttribute("user");
            hotelCollect hotelCollect= hotelCollectService.byUseridAndHotelIdQuery(users.getUserId(),hotelId);
            if(hotelCollect==null){
                model.addAttribute("state","未收藏");
            }else{
                model.addAttribute("state","已收藏");
            }
        }else{
            model.addAttribute("state","未收藏");
        }
        return "front_desk/HotelDetails";
    }

    /**
     * 预定调往订单页面
     * @param hid 酒店id
     * @param beginTime 入住日期
     * @param endTime 离开日期
     * @param productName 含早/不含早
     * @param price 价格
     * @param roomName 房间名称
     * @param bedType 床型
     * @param model
     * @return 订单页面
     */
    @RequestMapping("/hotelOrderIndex")
    public String hotelOrderIndex(String hid,String beginTime,String endTime,String productName,Double price,Model model,String roomName,String bedType) throws ParseException {
        model.addAttribute("hid",hid);
        model.addAttribute("beginTime",beginTime);
        model.addAttribute("endTime",endTime);
        model.addAttribute("productName",productName);
        model.addAttribute("price",price);
        model.addAttribute("roomName",roomName);
        model.addAttribute("bedType",bedType);
        SimpleDateFormat sDateFormat=new SimpleDateFormat("yyyy/MM/dd"); //加上时间
        Date date1=sDateFormat.parse(beginTime);
        Date date2=sDateFormat.parse(endTime);
        int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
        model.addAttribute("days",days); //入住天数
        return "/front_desk/HotelOrder";
    }

    //酒店订单支付页面
    @RequestMapping("/HotelOrderPayment")
    public String HotelOrderPayment(){
        return "/front_desk/HotelOrderPayment";
    }

    /**
     * 提交订单，调往订单支付页面
     * @param session 获取用户id
     * @param model 存放当前订单对象
     * @param hid
     * @param roomName
     * @param bedType
     * @param beginTime
     * @param endTime
     * @param lastTime
     * @param productName
     * @param amount
     * @param xingming
     * @param name
     * @param phone
     * @param email
     * @param remark
     * @return 订单支付页面
     */
    @RequestMapping("/HotelOrderPaymentIndex")
    public String HotelOrderPaymentIndex(Model model,HttpSession session,String hid,String roomName,String bedType,String beginTime,String endTime,String lastTime,String productName,Double amount,String xingming,String name,String phone,String email,String remark){
        String userid=((users)(session.getAttribute("user"))).getUserId();
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyyMMddHHmmss");
        String orderId=simpleDateFormat.format(new Date());
        hotelorders hotelorders=new hotelorders(orderId,hid,roomName,bedType,beginTime,endTime,lastTime,productName,amount,xingming,name,phone,email,remark,userid,"待支付",new Timestamp(System.currentTimeMillis()));
        hotelOrdersService.addHotelOrder(hotelorders);
        model.addAttribute("hotelOrder",hotelorders);
        return "/front_desk/HotelOrderPayment";
    }

}
