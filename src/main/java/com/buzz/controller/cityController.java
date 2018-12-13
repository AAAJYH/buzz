package com.buzz.controller;

import com.buzz.entity.Paging;
import com.buzz.entity.city;
import com.buzz.entity.strategy;
import com.buzz.service.cityService;
import com.buzz.utils.Upload;
import com.buzz.utils.WriteExcel;
import com.buzz.service.strategyService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public Paging<city> pagingQueryCity(Integer page,Integer rows,String type,String val){
        return cityservice.PagingQueryAll(page,rows,type,val);
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
            if(!file.getName().equals("wKgB6lSgx0KAAtuCAAVoSPI1DUk40.jpeg")) //默认图片不删除
            file.delete();
        }
        //修改城市图片路径
        int rs=cityservice.byCityIdUpdateCityPhoto(CityId,"images/cityPhoto/"+imgName);
        return rs;
    }

    /**
     * 全部城市写入Excel，保存到桌面
     * @return
     * @throws IOException
     * @throws IllegalAccessException
     */
    @RequestMapping("/WriteExcel")
    @ResponseBody
    public String WriteExcel() throws IOException, IllegalAccessException {
        String rs="success";
        try {
            //城市集合
            List<city> cityList=cityservice.CityListWriteExcel();
            //生成桌面路径
            FileSystemView fsv = FileSystemView.getFileSystemView();
            String path=fsv.getHomeDirectory().toString()+"\\城市集合.xls";
            File file=new File(path);
            if(file.exists()){
                file.delete();
            }
            WriteExcel<city> we=new WriteExcel<city>();
            we.write(cityList,path,city.class);
        }catch(Exception e){ //捕捉异常
            String exceptionToString=e.toString();
            if(exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException")){
                rs="另一个程序正在使用此文件，进程无法访问。";
            }
        }
        return rs;
    }

    /**
     * 根据城市Id查询城市
     * @param CityId
     * @return
     */
    @RequestMapping("/ByCityIdQuery")
    @ResponseBody
    public city ByCityIdQuery(String CityId){
        return cityservice.byCityIdQuery(CityId);
    }

    /**
     * 根据城市编号查询城市
     * @param cityId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_cityBycityId")
    public Map<String,Object> find_cityBycityId(String cityId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        city city=cityservice.byCityIdQuery(cityId);
        if(null!=city)
        {
            map.put("result",true);
            map.put("city",city);
        }
        else
            map.put("result",false);
        return map;
    }
    /**
     * 查询全部城市
     * @return
     */
    @RequestMapping("/queryAllCity")
    @ResponseBody
    public List<city> queryAllCity(){
        return cityservice.queryAllCity();
    }

    /**
     * 酒店页面模糊查询
     * @param cityName
     * @return
     */
    @RequestMapping("/byCityNameQuery")
    @ResponseBody
    public List<city> byCityNameQuery(String cityName){
        return cityservice.byCityNameQuery(cityName);
    }

    /**
     * 通过城市名字搜索城市
     * @param cityName
     * @return
     */
    @RequestMapping("find_cityBycityNameNolike")
    @ResponseBody
    public List<city> find_cityBycityNameNolike(String cityName)
    {
        return  cityservice.find_cityBycityNameNolike(cityName,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
    }

    /**
     * 城市搜索次数报表页面
     * @return
     */
    @RequestMapping("/citySearchCharts")
    public String citySearchCharts(){
        return "backstage_supporter/citySearchECharts";
    }

    /**
     * 查询所有城市和搜索次数
     * @return
     */
    @RequestMapping("/queryCitySearchNumber")
    @ResponseBody
    public List<Map<String,Object>> queryCitySearchNumber(){
        return cityservice.queryCitySearchNumber();
    }

    /**
     * 城市攻略下载次数报表页面
     * model 保存城市名称和攻略下载次数Map集合
     * @return
     */
    @RequestMapping("/cityStrategyDownLoadECharts")
    public String cityStrategyDownLoadECharts(Model model){
        List<Map<String,Object>> mapList=cityservice.queryCityNameAndStrategyDownloadNumber();
        model.addAttribute("mapList",mapList);
        return "/backstage_supporter/cityStrategyDownLoadECharts";
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
