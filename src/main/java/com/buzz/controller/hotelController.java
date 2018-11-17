package com.buzz.controller;

import com.buzz.entity.*;
import com.buzz.service.*;
import com.buzz.utils.WriteExcel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.*;

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

    @Resource
    cityService cityService;

    @Resource
    provinceService provinceService;

    /**
     * 查看城市酒店
     * @param model 景点集合
     * @param request 获取ServletContext对象
     * @param scenicspotId 默认选中的id
     * @return 酒店页面
     */
    @RequestMapping("/hotelIndex")
    public String hotelIndex(Model model, HttpServletRequest request,String scenicspotId,String cityName){
        city city=null;
        if(cityName.equals("")){
            city=(city) request.getServletContext().getAttribute("city");
        }else{
            city=cityService.byCityNameQueryCity(cityName);
            request.getServletContext().setAttribute("city",city);
        }
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
    public String hotelOrderIndex(String hid,String beginTime,String endTime,String productName,Double price,Model model,String roomName,String bedType,String hotelName,String defaultPicture) throws ParseException {
        model.addAttribute("hid",hid);
        model.addAttribute("beginTime",beginTime);
        model.addAttribute("endTime",endTime);
        model.addAttribute("productName",productName);
        model.addAttribute("price",price);
        model.addAttribute("roomName",roomName);
        model.addAttribute("bedType",bedType);
        model.addAttribute("hotelName",hotelName);
        model.addAttribute("defaultPicture",defaultPicture);
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
     * 提交订单
     * @param session 获取用户id
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
     * @return 酒店订单支付方法
     */
    @RequestMapping("/addHotelOrder")
    public String addHotelOrder(HttpSession session, String hid, String roomName, String bedType, String beginTime, String endTime, String lastTime, String productName, Double amount, String xingming, String name, String phone, String email, String remark,String hotelName,String defaultPicture) throws ParseException {
        //获取用户id、当前时间生成订单号，执行添加订单方法
        String userid="";
        if(session.getAttribute("user")!=null){
            userid=((users)(session.getAttribute("user"))).getUserId();
        }
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyyMMddHHmmss");
        String orderId=simpleDateFormat.format(new Date());
        hotelorders hotelorders=new hotelorders(orderId,hid,roomName,bedType,beginTime,endTime,lastTime,productName,amount,xingming,name,phone,email,remark,userid,"待支付",new Timestamp(System.currentTimeMillis()),hotelName,defaultPicture);
        hotelOrdersService.addHotelOrder(hotelorders);
        session.setAttribute("hotelOrderId",orderId);
        return "redirect:/hotelController/HotelOrderPaymentIndex";
    }

    /**
     * 添加完酒店订单后，调往酒店订单支付页面
     * @param session 获取用户id
     * @param model 保存待支付订单剩余时间
     * @return 酒店订单支付页面
     */
    @RequestMapping("/HotelOrderPaymentIndex")
    public String HotelOrderPaymentIndex(HttpSession session,Model model){
        //根据订单id查询订单保存request中
        String hotelOrderId= (String) session.getAttribute("hotelOrderId");
        hotelorders hotelorders=hotelOrdersService.byHotelOrderIdQuery(hotelOrderId);
        model.addAttribute("hotelOrder",hotelorders);
        if(hotelorders.getState().equals("待支付")){
            Timestamp orderDate=hotelorders.getSubTime();
            Long orderTime=orderDate.getTime()+1*60*1000;
            Long currentTime=System.currentTimeMillis();
            int sumSecond= (int) ((orderTime-currentTime)/1000);
            int fen= sumSecond/60;
            int miao=sumSecond-fen*60;
            model.addAttribute("fen",fen);
            model.addAttribute("miao",miao);
        }
        return "front_desk/HotelOrderPayment";
    }

    /**
     * ajax修改订单状态
     * @param HotelOrderId
     * @return
     */
    @RequestMapping("/UpdateHotelOrderState")
    @ResponseBody
    public int UpdateHotelOrderState(String HotelOrderId){
        int rs=hotelOrdersService.byHotelOrderIdUpdateState(HotelOrderId,"超时未支付");
        return rs;
    }

    /**
     * 后台酒店管理页面
     * @return
     */
    @RequestMapping("/hotelOrderManageIndex")
    public String hotelOrderManageIndex(){
        return "backstage_supporter/hotelOrderManage";
    }

    /**
     * 后台分页查询
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/PagingQueryAllHotelOrders")
    @ResponseBody
    public Paging<hotelorders> PagingQueryAllHotelOrders(Integer page,Integer rows,String state){
        return hotelOrdersService.PagingQueryHotelOrders(page,rows,state);
    }

    //查询写Excel
    @RequestMapping("/HotelOrderWriteExcel")
    @ResponseBody
    public String HotelOrderWriteExcel(){
        String rs="success";
        try {
            //城市集合
            List<hotelorders> hotelordersList=hotelOrdersService.HotelOrderWriteExcel();
            //生成桌面路径
            FileSystemView fsv = FileSystemView.getFileSystemView();
            String path=fsv.getHomeDirectory().toString()+"\\酒店订单集合.xls";
            File file=new File(path);
            if(file.exists()){
                file.delete();
            }
            WriteExcel<hotelorders> we=new WriteExcel<hotelorders>();
            we.write(hotelordersList,path,hotelorders.class);
        }catch(Exception e){ //捕捉异常
            String exceptionToString=e.toString();
            if(exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException")){
                rs="另一个程序正在使用此文件，进程无法访问。";
            }
        }
        return rs;
    }

    @RequestMapping("/hotel2Index")
    public String hotel2Index(Model model){
        //查询热门省
        List<Map<String,Object>> provinceMap=provinceService.queryHotProvince();
        //转换成省集合
        List<province> provinceList=new ArrayList<province>();
        if(provinceMap.size()>0){
            for (Map map:provinceMap) {
                provinceList.add(provinceService.byProvinceIdQuery((String) map.get("provinceId")));
            }
        }
        model.addAttribute("provinceList",provinceList); //存省集合
        List list=new ArrayList();
        for (province p:provinceList) {
            list.add(cityService.byProvinceIdQueryHot(p.getProvinceId()));
        }
        model.addAttribute("cityList",list);
        return "front_desk/hotel2";
    }

    /**
     * 通过用户编号和状态查询酒店订单
     * @param session
     * @param stateIds
     * @return
     */
    @ResponseBody
    @RequestMapping("find_hotelOrdersByuserIdAndstateId")
    public Map<String,Object> find_hotelOrdersByuserIdAndstateId(HttpSession session,String stateIds)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        List<hotelorders> hotelOrders=new ArrayList<hotelorders>();
        if(null==stateIds||"".equals(stateIds))
            hotelOrders=hotelOrdersService.find_hotelOrdersByuserIdAndstateId(user.getUserId(),"已支付","待支付","超时未支付");
        else if("48d4c6ab-9b7b-4d95-b1ee-e26ee58c2550".equals(stateIds))
            hotelOrders=hotelOrdersService.find_hotelOrdersByuserIdAndstateId(user.getUserId(),"已支付");
        else if("be6f2782-0c94-436b-91fe-3a7cf3b37bcc".equals(stateIds))
            hotelOrders=hotelOrdersService.find_hotelOrdersByuserIdAndstateId(user.getUserId(),"待支付");
        else if("7a0dbb86-2325-4ff1-9e79-0e4321354ee2".equals(stateIds))
            hotelOrders=hotelOrdersService.find_hotelOrdersByuserIdAndstateId(user.getUserId(),"超时未支付");
        map.put("user",user);
        map.put("hotelOrders",hotelOrders);
        return map;
    }

    @RequestMapping("HotelOrderPaymentIndexByhotelOrderId")
    public String HotelOrderPaymentIndex(String hotelOrderId,Model model)
    {
        //根据订单id查询订单保存request中
        hotelorders hotelorders=hotelOrdersService.byHotelOrderIdQuery(hotelOrderId);
        model.addAttribute("hotelOrder",hotelorders);
        if(hotelorders.getState().equals("待支付")){
            Timestamp orderDate=hotelorders.getSubTime();
            Long orderTime=orderDate.getTime()+1*60*1000;
            Long currentTime=System.currentTimeMillis();
            int sumSecond= (int) ((orderTime-currentTime)/1000);
            int fen= sumSecond/60;
            int miao=sumSecond-fen*60;
            model.addAttribute("fen",fen);
            model.addAttribute("miao",miao);
        }
        return "front_desk/HotelOrderPayment";
    }
}
