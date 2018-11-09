package com.buzz.controller;

import com.buzz.entity.*;
import com.buzz.service.*;
import com.buzz.utils.Upload;
import com.buzz.utils.WriteExcel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/30 11:12
 * 景点控制层
 */

@Controller
@RequestMapping("/scenicspotController")
public class scenicspotController {

    @Resource
    scenicspotService scenicspotService;

    @Resource
    cityService cityService;

    @Resource
    scenicspotCollectService scenicspotCollectService;


    /**
     * 查询城市的全部景点
     *
     * @param cityId
     * @return 景点列表html
     * ServletContext 保存城市对象
     */
    @RequestMapping("/byCityIdQueryScenicspot")
    public String byCityIdQueryScenicspot(String cityId, Model model, HttpServletRequest request) {
        //当前城市查询次数加一
        cityService.SearchNumberAddOne(cityId);
        //景点集合
        List<scenicspot> scenicspotsList = scenicspotService.byCityIdQueryScenicspot(cityId);
        for (scenicspot s : scenicspotsList) {
            s.setSynopsis(s.getSynopsis().substring(0, 60));
        }
        model.addAttribute("scenicspotList", scenicspotsList);
        //保存session级别的城市景点信息
        city city = cityService.byCityIdQuery(cityId);
        request.getServletContext().setAttribute("city", city);
        return "front_desk/ScenicSpot";
    }

    /**
     * 查询景点详情
     *
     * @param scenicSpotId
     * @param model        景点对象
     * @param session      获取当前用户对象
     * @return 详情页面
     */
    @RequestMapping("/byScenicSpotIdQueryScenicSpot")
    public String byScenicSpotIdQueryScenicSpot(String scenicSpotId, Model model, HttpServletRequest request, HttpSession session) {

        //景点对象
        scenicspot scenicspot = scenicspotService.byScenicSpotIdQueryScenicSpot(scenicSpotId);
        model.addAttribute("scenicspot", scenicspot);

        //城市对象
        city city = cityService.byCityIdQuery(scenicspot.getCityId());
        model.addAttribute("city", city);

        //当前用户是否收藏
        if (session.getAttribute("user") != null) { //是否登录
            scenicspotCollect scenicspotCollect = scenicspotCollectService.byUseridAndScenicspotIdQuery(scenicspot.getScenicSpotId(), ((users) session.getAttribute("user")).getUserId());
            if (scenicspotCollect != null) {
                model.addAttribute("state", "已收藏");
            } else {
                model.addAttribute("state", "未收藏");
            }
        } else {
            model.addAttribute("state", "未收藏");
        }

        return "front_desk/ScenicSpotDetails";
    }

    @RequestMapping("/comment")
    @ResponseBody
    public String comment(MultipartFile img) throws Exception {
        String path = ResourceUtils.getURL("src/main/resources/static/images/upload/").getPath(); //获取当前项目文件的绝对路径
        String imgName = Upload.upload(img, path);
        return "/images/upload/" + imgName;
    }

    /**
     * 后台景点管理页面
     *
     * @return
     */
    @RequestMapping("/scenicspotManageIndex")
    public String scenicspotManageIndex() {
        return "backstage_supporter/scenicspotManage";
    }

    //后台分页查询景点
    @RequestMapping("/PagingQueryScenicspot")
    @ResponseBody
    public Paging<scenicspot> PagingQueryScenicspot(Integer page, Integer rows) {
        return scenicspotService.PagingQueryScenicspot(page, rows);
    }

    //添加景点
    @RequestMapping("/addScenicSpot")
    @ResponseBody
    public int addScenicSpot(String chineseName, String englishName, String address, String synopsis, String phone, String url, String traffic, String tickets, String openingHours, String longitude, String latitude, String cityId, String stateId) {
        String scenicSpotId = UUID.randomUUID().toString();
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        return scenicspotService.addScenicSpot(scenicSpotId, chineseName, englishName, address, synopsis, phone, url, traffic, tickets, openingHours, longitude, latitude, cityId, currentTime, stateId);
    }

    //修改景点
    @RequestMapping("/byScenicspotIdUpdateScenicspot")
    @ResponseBody
    public int byScenicspotIdUpdateScenicspot(String scenicSpotId, String chineseName, String englishName, String address, String synopsis, String phone, String url, String traffic, String tickets, String openingHours, String longitude, String latitude, String cityId, String stateId) {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        return scenicspotService.byScenicspotIdUpdateScenicspot(scenicSpotId, chineseName, englishName, address, synopsis, phone, url, traffic, tickets, openingHours, longitude, latitude, cityId, currentTime, stateId);
    }

    //修改景点图片
    @RequestMapping("/byScenicspotIdUpdatePhoto")
    @ResponseBody
    public String byScenicspotIdUpdatePhoto(String id,String deleteImage) throws FileNotFoundException {
            //1.根据景点id查询景点对象
            scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(id);
            if(scenicspot.getPhoto().split(",").length>3){
                //2.图片字符串移除删除的字符串
                String photo="";
                if(scenicspot.getPhoto().lastIndexOf(","+deleteImage)>0){
                    photo=scenicspot.getPhoto().replace(","+deleteImage,"");
                }else{
                    photo=scenicspot.getPhoto().replace(deleteImage+",","");
                }
                //3.从文件夹中移除删除的文件
                String deletePath=ResourceUtils.getURL("src/main/resources/static").getPath().replace("%20"," ");
                deletePath+=deleteImage;
                File file=new File(deletePath);
                //默认图片不删除
                if(file.exists()&&!deleteImage.equals("images/ScenicSpotPhoto/wKgBEFrhb3SAN3dcABAft7C2kYs76.jpg")&&!deleteImage.equals("images/ScenicSpotPhoto/wKgBEFrhb3WAAh2WAA0__QZImJU16.jpg")&&!deleteImage.equals("images/ScenicSpotPhoto/wKgBEFrhb3WAakoZAAf3cRjwZCY02.jpg")){
                    file.delete();
                }
                //修改图片
                scenicspotService.byScenicspotIdUpdatePhoto(id,photo);
                //重新获取景点图片返回
                scenicspot scenicspot1=scenicspotService.byScenicSpotIdQueryScenicSpot(id);
                return scenicspot1.getPhoto();
            }else{
                return "景点图片不能少于三张";
            }
        }

    @RequestMapping("/uploadScenicspotPhoto")
    @ResponseBody
    public synchronized String handleRequest(@RequestParam("fileList") MultipartFile fileList, String id) throws Exception {
        //1.获取项目下指定文件夹的绝对路径
        String path= ResourceUtils.getURL("src/main/resources/static/images/ScenicSpotPhoto/").getPath(); //获取当前项目文件的绝对路径
        //2.上传图片返回图片路径
        String imgName= Upload.upload(fileList,path);
        String photo="images/ScenicSpotPhoto/"+imgName;
        //3.修改数据库photo的值
        scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(id); //先查询Photo值
        scenicspotService.byScenicspotIdUpdatePhoto(id,scenicspot.getPhoto()+","+photo);
        return "";
    }

    /**
     * 景点集合写入Excel
     * @throws IOException
     * @throws IllegalAccessException
     */
    @RequestMapping("/WriteExcel")
    @ResponseBody
    public String WriteExcel() {
        String rs="";
        try {
            //查询景点集合
            List<scenicspot> scenicspotList=scenicspotService.QueryAllScenicspotWriteExcel();
            //获取桌面路径
            FileSystemView fileSystemView=FileSystemView.getFileSystemView();
            String homePath=fileSystemView.getHomeDirectory().getPath()+"\\景点集合.xls";
            //如果文件存在就删除
            File file=new File(homePath);
            if(file.exists()){
                file.delete();
            }
            //写
            WriteExcel<scenicspot> writeExcel=new WriteExcel<scenicspot>();
            writeExcel.write(scenicspotList,homePath,scenicspot.class);
        }catch(Exception e){
            String exceptionToString=e.toString();
            if(exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException")){
                rs="另一个程序正在使用此文件，进程无法访问。";
            }
        }
        return rs;
    }

}
