package com.buzz.controller;

import com.buzz.dao.provinceDao;
import com.buzz.entity.Paging;
import com.buzz.entity.city;
import com.buzz.entity.province;
import com.buzz.service.provinceService;
import com.buzz.utils.WriteExcel;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

/**
 * @Author: jyh
 * @Date: 2018/11/4 15:53
 * 省控制层
 */

@Controller
@RequestMapping("/ProvinceController")
public class ProvinceController {

    @Resource
    provinceService provinceService;

    /**
     * 后台根据省id查询省对象
     * @param provinceId
     * @return
     */
    @RequestMapping("/byProvinceIdQuery")
    @ResponseBody
    public province byProvinceIdQuery(String provinceId){
        return provinceService.byProvinceIdQuery(provinceId);
    }

    /**
     * 前台查询全部省
     * @return
     */
    @RequestMapping("/queryProvinceAll")
    @ResponseBody
    public List<province> queryProvinceAll(){
        return provinceService.ByStateQueryProvince();
    }

    /**
     * 后台省市管理页面
     * @return
     */
    @RequestMapping("/ProvinceIndex")
    public String ProvinceIndex(){
        return "backstage_supporter/provinceManage";
    }

    /**
     * 后台分页查询
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/PagingQueryProvince")
    @ResponseBody
    public Paging<province> PagingQueryProvince(Integer page, Integer rows,String provinceName){
        Paging<province> paging=provinceService.PagingQueryProvince(page,rows,provinceName);
        return paging;
    }

    /**
     * 后台添加省
     * @param provinceName
     * @param stateId
     * @return
     */
    @RequestMapping("/addProvince")
    @ResponseBody
    public int addProvince(String provinceName,String stateId){
        String provinceId= UUID.randomUUID().toString();
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        return provinceService.addProvince(provinceId,provinceName,stateId,currentTime);
    }

    /**
     * 后台修改省
     * @param provinceId
     * @param provinceName
     * @param stateId
     * @return
     */
    @RequestMapping("/byProvinceIdUpdate")
    @ResponseBody
    public int byProvinceIdUpdate(String provinceId,String provinceName,String stateId){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        return provinceService.byProvinceIdUpdate(provinceId,provinceName,stateId,currentTime);
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
            List<province> provinceList=provinceService.ProvinceListWriteExcel();
            System.out.println(provinceList);
            //生成桌面路径
            FileSystemView fsv = FileSystemView.getFileSystemView();
            String path=fsv.getHomeDirectory().toString()+"\\省市集合.xls";
            File file=new File(path);
            if(file.exists()){
                file.delete();
            }
            WriteExcel<province> we=new WriteExcel<province>();
            we.write(provinceList,path,province.class);
        }catch(Exception e){ //捕捉异常
            String exceptionToString=e.toString();
            if(exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException")){
                rs="另一个程序正在使用此文件，进程无法访问。";
            }
        }
        return rs;
    }


}
