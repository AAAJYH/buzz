package com.buzz.controller;

import com.buzz.entity.city;
import com.buzz.entity.Paging;
import com.buzz.entity.interestLabel;
import com.buzz.service.cityService;
import com.buzz.service.interestLabelService;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@Controller
@RequestMapping("interestLabelController")
public class interestLabelController
{
    @Resource
    private interestLabelService interestlabelservice;
    @Resource
    private cityService cityservice;
    /**
     * 通过状态编号查询兴趣标签
     * @return
     */
    @ResponseBody
    @RequestMapping("find_interestLabelBystateId")
    public List<interestLabel> find_interestLabelBystateId()
    {
        return interestlabelservice.find_interestLabelBystateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
    }

    /**
     * 后台标签管理页面
     * @return
     */
    @RequestMapping("/interesLabelManageIndex")
    public String interesLabelManageIndex(){
        return "backstage_supporter/interesLabelManage";
    }

    /**
     * 后台分页查询标签
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/PagingQuery")
    @ResponseBody
    public Paging<interestLabel> PagingQuery(Integer page, Integer rows,interestLabel interestLabel){
        return interestlabelservice.PagingQuery(page,rows,interestLabel);
    }

    /**
     * 添加标签
     * @param interestLabel
     * @return
     */
    @RequestMapping("/addLabel")
    @ResponseBody
    public int addLabel(interestLabel interestLabel){
        String id= UUID.randomUUID().toString(); //uuid
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //创建时间
        interestLabel.setInterestLabelId(id);
        interestLabel.setReleaseTime(currentTime);
        return interestlabelservice.addLabel(interestLabel);
    }

    /**
     * 修改标签
     * @param interestLabel
     * @return
     */
    @RequestMapping("/updateLabel")
    @ResponseBody
    public int updateLabel(interestLabel interestLabel){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //创建时间
        interestLabel.setReleaseTime(currentTime);
        interestLabel.setReleaseTime(currentTime);
        return interestlabelservice.updateLabel(interestLabel);
    }


    /**
     * 通过键盘按下值和状态编号查询
     * @param keyvalue
     * @return
     */
    @ResponseBody
    @RequestMapping("find_interestLabelBykeyvalueAndstateId")
    public Map<String,Object> find_interestLabelBykeyvalueAndstateId(String keyvalue)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<interestLabel> interestLabels=interestlabelservice.find_interestLabelBykeyvalueAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
        map.put("interestLabel",interestLabels);
        List<city> city=cityservice.find_cityBycityNameAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
        map.put("city",city);
        return map;
    }
}
