package com.buzz.controller;

import com.buzz.entity.*;
import com.buzz.service.*;
import com.buzz.utils.Upload;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

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
     * @param cityId
     * @return 景点列表html
     * ServletContext 保存城市对象
     */
    @RequestMapping("/byCityIdQueryScenicspot")
    public String byCityIdQueryScenicspot(String cityId, Model model, HttpServletRequest request){
        //景点集合
        List<scenicspot> scenicspotsList=scenicspotService.byCityIdQueryScenicspot(cityId);
        for (scenicspot s:scenicspotsList) {
            s.setSynopsis(s.getSynopsis().substring(0,60));
        }
        model.addAttribute("scenicspotList",scenicspotsList);
        //保存session级别的城市景点信息
        city city=cityService.byCityIdQuery(cityId);
        request.getServletContext().setAttribute("city",city);
        return "front_desk/ScenicSpot";
    }

    /**
     * 查询景点详情
     * @param scenicSpotId
     * @param model 景点对象
     * @param session 获取当前用户对象
     * @return 详情页面
     */
    @RequestMapping("/byScenicSpotIdQueryScenicSpot")
    public String byScenicSpotIdQueryScenicSpot(String scenicSpotId, Model model, HttpServletRequest request, HttpSession session){

        //景点对象
        scenicspot scenicspot=scenicspotService.byScenicSpotIdQueryScenicSpot(scenicSpotId);
        model.addAttribute("scenicspot",scenicspot);

        //城市对象
        city city=cityService.byCityIdQuery(scenicspot.getCityId());
        model.addAttribute("city",city);

        //当前用户是否收藏
        if(session.getAttribute("user")!=null){ //是否登录
            scenicspotCollect scenicspotCollect=scenicspotCollectService.byUseridAndScenicspotIdQuery(scenicspot.getScenicSpotId(),((users)session.getAttribute("user")).getUserId());
            if(scenicspotCollect!=null){
                model.addAttribute("state","已收藏");
            }else{
                model.addAttribute("state","未收藏");
            }
        }else{
            model.addAttribute("state","未收藏");
        }

        return "front_desk/ScenicSpotDetails";
    }

    @RequestMapping("/comment")
    @ResponseBody
    public String comment(MultipartFile img) throws Exception {
        String path= ResourceUtils.getURL("src/main/resources/static/images/upload/").getPath(); //获取当前项目文件的绝对路径
        String imgName=Upload.upload(img,path);
        return "/images/upload/"+imgName;
    }

}
