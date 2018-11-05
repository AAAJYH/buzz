package com.buzz.controller;

import com.buzz.entity.Paging;
import com.buzz.entity.city;
import com.buzz.service.cityService;
import com.buzz.utils.Upload;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileNotFoundException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("cityController")
public class cityController {
    @Resource
    private cityService cityservice;

    @ResponseBody
    @RequestMapping("find_cityBykeyUp")
    public List<city> find_cityBykeyUp(String cityName)
    {
        return cityservice.byCityNameQuery(cityName);
    }

    /**
     * 后台城市管理页面
     * @return
     */
    @RequestMapping("/cityManageIndex")
    public String cityManageIndex(){
        return "backstage_supporter/cityManage";
    }

    /**
     * 分页查询全部城市
     * @param page 要显示的页数
     * @param rows 每页显示的行数
     * @return 城市集合
     */
    @RequestMapping("/pagingQueryCity")
    @ResponseBody
    public Paging<city> pagingQueryCity(Integer page,Integer rows){
        return cityservice.PagingQueryAll(page,rows);
    }

    /**
     * 修改城市状态
     * @param cityId
     * @param stateId
     * @return
     */
    @RequestMapping("/byCityIdUpdateState")
    @ResponseBody
    public int byCityIdUpdateState(String cityId,String stateId){
        return cityservice.byCityIdUpdateState(cityId,stateId);
    }

    /**
     * 后台添加城市
     * @param cityName 城市名称
     * @param citySituation 城市概括
     * @param provinceId 省Id
     * @param stateId 状态Id
     * @return 添加结果
     */
    @RequestMapping("/addCity")
    @ResponseBody
    public int addCity(String cityName,String citySituation,String provinceId,String stateId){
        String cityId= UUID.randomUUID().toString(); //城市id
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //插入时间
        Integer searchNumber=0; //搜索次数
        return cityservice.addCity(searchNumber,cityId,cityName,citySituation,provinceId,stateId,currentTime);
    }

    //修改城市
    @RequestMapping("/byCityIdUpdateInfo")
    @ResponseBody
    public int byCityIdUpdateInfo(String cityName,String citySituation,String provinceId,String stateId,String cityId){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //当前时间
        return cityservice.byCityIdUpdateInfo(cityName,citySituation,provinceId,stateId,currentTime,cityId);
    }

    /**
     * 修改城市图片
     * @param CityId
     * @param cityPhoto
     * @return
     */
    @RequestMapping("/byCityIdUpdateCityPhoto")
    @ResponseBody
    public int byCityIdUpdateCityPhoto(String CityId,MultipartFile cityPhoto) throws Exception {
        //获取项目下指定文件夹的绝对路径
        String path= ResourceUtils.getURL("src/main/resources/static/images/cityPhoto/").getPath(); //获取当前项目文件的绝对路径
        //图片上传
        String imgName= Upload.upload(cityPhoto,path);
        //删除之前图片
        String deletePath=ResourceUtils.getURL("src/main/resources/static").getPath();
        city city=cityservice.byCityIdQuery(CityId);
        String photo=city.getCityPhoto();
        File file=new File(deletePath.replace("%20"," ")+"/"+photo);
        if(file.exists()){
            file.delete();
        }
        //修改城市图片路径
        int rs=cityservice.byCityIdUpdateCityPhoto(CityId,"images/cityPhoto/"+imgName);
        return rs;
    }

}
