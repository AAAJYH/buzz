package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.scenicspot;
import com.buzz.entity.strategy;
import com.buzz.service.cityService;
import com.buzz.service.scenicspotService;
import com.buzz.service.strategyService;
import com.buzz.utils.Upload;
import com.buzz.utils.WriteExcel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileNotFoundException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

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
    @Resource
    private cityService cityservice;
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
            List<strategy> OtherStrategy=strategyService.queryOhterStrategy(strategy.getStrategyId(),city.getCityId());
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

    /**
     * 调往后台攻略管理页面
     * @return
     */
    @RequestMapping("/strategyManageIndex")
    public String strategyManageIndex(){
        return "backstage_supporter/strategyManage";
    }

    /**
     * 后台查询全部攻略
     * @return
     */
    @RequestMapping("/queryAllStrategy")
    @ResponseBody
    public List<strategy> queryAllStrategy(){
        return strategyService.queryAllStrategy();
    }

    //添加攻略
    @RequestMapping("/addStrategy")
    @ResponseBody
    public int addStrategy(String strategyHeadline,String strategyBriefIntroduction,String scenicSpot,String cityId,String stateId){
        String strategyId= UUID.randomUUID().toString(); //id
        long downloadNumber=0; //下载次数
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //当前时间
        return strategyService.addStrategy(strategyId,strategyHeadline,strategyBriefIntroduction,scenicSpot,cityId,downloadNumber,currentTime,stateId);
    }

    /**
     * 后台修改攻略
     * @param strategyHeadline 标题
     * @param strategyBriefIntroduction 概括
     * @param scenicSpot 相关城市
     * @param cityId 城市外键
     * @param strategyId 攻略id
     * @return
     */
    @RequestMapping("/byStrategyIdUpdateStrategy")
    @ResponseBody
    public int byStrategyIdUpdateStrategy(String strategyHeadline,String strategyBriefIntroduction,String scenicSpot,String cityId,String strategyId,String stateId){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        return strategyService.byStrategyIdUpdateStrategy( strategyHeadline, strategyBriefIntroduction, scenicSpot, cityId, currentTime, strategyId,stateId);
    }

    @RequestMapping("/WriteExcel")
    @ResponseBody
    public String WriteExcel(){
        String rs="";
        try {
            //查询攻略集合
            List<strategy> strategyList=strategyService.StrategyWriteExcel();
            //获取桌面路径
            FileSystemView fileSystemView=FileSystemView.getFileSystemView();
            String homePath=fileSystemView.getHomeDirectory().getPath()+"\\攻略集合.xls";
            File file=new File(homePath);
            if(file.exists()){
                file.delete();
            }
            //写
            WriteExcel<strategy> writeExcel=new WriteExcel<strategy>();
            writeExcel.write(strategyList,homePath,strategy.class);
        }catch(Exception e){
            String exceptionToString=e.toString();
            if(exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException")){
                rs="另一个程序正在使用此文件，进程无法访问。";
            }
        }
        return rs;
    }

    //修改景点图片
    @RequestMapping("/byStrategyIdQueryStrategy")
    @ResponseBody
    public String byStrategyIdQueryStrategy(String id,String deleteImage) throws FileNotFoundException {
        //1.根据景点id查询景点对象
        strategy strategy=strategyService.byStrategyIdQueryStrategy(id);
        if(strategy.getStrategyPhoto().split(",").length>1){
            //2.图片字符串移除删除的字符串
            String photo="";
            if(strategy.getStrategyPhoto().lastIndexOf(","+deleteImage)>0){
                photo=strategy.getStrategyPhoto().replace(","+deleteImage,"");
            }else{
                photo=strategy.getStrategyPhoto().replace(deleteImage+",","");
            }
            //3.从文件夹中移除删除的文件
            String deletePath= ResourceUtils.getURL("src/main/resources/static").getPath().replace("%20"," ");
            deletePath+=deleteImage;
            File file=new File(deletePath);
            //默认图片不删除
            if(file.exists()&&!deleteImage.equals("images/gonglve/beijing1.jpg")){
                file.delete();
            }
            //修改图片
            strategyService.byStrategyIdUpdatePhoto(id,photo);
            //重新获取景点图片返回
            strategy strategy1=strategyService.byStrategyIdQueryStrategy(id);
            return strategy1.getStrategyPhoto();
        }else{
            return "景点图片不能少于一张";
        }
    }

    /**
     * 添加攻略图片
     * @param fileList
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping("/uploadStrategyPhoto")
    @ResponseBody
    public synchronized String uploadStrategyPhoto(@RequestParam("fileList") MultipartFile fileList, String id) throws Exception {
        //1.获取项目下指定文件夹的绝对路径
        String path= ResourceUtils.getURL("src/main/resources/static/images/gonglve/").getPath(); //获取当前项目文件的绝对路径
        //2.上传图片返回图片路径
        String imgName= Upload.upload(fileList,path);
        String photo="images/gonglve/"+imgName;
        //3.修改数据库photo的值
        strategy strategy=strategyService.byStrategyIdQueryStrategy(id); //先查询Photo值
        strategyService.byStrategyIdUpdatePhoto(id,strategy.getStrategyPhoto()+","+photo);
        return "";
    }

    /**
     * 设置攻略头图
     * @param strategyId 攻略id
     * @param photo 要修改的图片
     * @return
     */
    @RequestMapping("/setHeadPhoto")
    @ResponseBody
    public String setHeadPhoto(String strategyId,String photo){
        //1.先移除photo图片
        strategy strategy=strategyService.byStrategyIdQueryStrategy(strategyId);
        String images=strategy.getStrategyPhoto();
        images=images.replace(","+photo,"");
        //2.在将Photo图片添加到头部
        strategyService.byStrategyIdUpdatePhoto(strategyId,photo+","+images);
        //3.返回攻略图片属性
        strategy strategy1=strategyService.byStrategyIdQueryStrategy(strategyId);
        return strategy1.getStrategyPhoto();
    }
    /**
     * 获取下载数量最多的五个旅游攻略
     * @return
     */
    @ResponseBody
    @RequestMapping("find_strategyHot5")
    public List<strategy> find_strategyHot5()
    {
        return strategyService.find_strategyHot5();
    }

    /**
     * 根据旅游攻略编号查询
     * @param model
     * @param
     * @return
     */
    @RequestMapping("find_strategyBystrategyId")
    public String find_strategyBystrategyId(Model model,String strategyId,HttpServletRequest request)
    {
        strategy strategy=strategyService.find_strategyBystrategyId(strategyId);
        city city=cityservice.byCityIdQuery(strategy.getCityId());
        request.getServletContext().setAttribute("city",city);
        model.addAttribute("strategy",strategy);
        return "/front_desk/Strategy";
    }

    /**
     * 根据城市编号查询旅游攻略,只查询五条
     * @param cityId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_strategyBycityIdR5")
    public List<strategy> find_strategyBycityIdR5(String cityId)
    {
        return strategyService.find_strategyBycityIdAndstateId(1,5,cityId,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
    }
}
