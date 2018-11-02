package com.buzz.controller;

import com.buzz.entity.travelCollection;
import com.buzz.entity.users;
import com.buzz.service.travelCollectionService;
import com.buzz.utils.Encryption;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("travelCollectionController")
public class travelCollectionController
{
    @Resource
    private travelCollectionService travelcollectionservice;

    /**
     * 根据游记编号查询游记收藏
     * @param travelNotesId 游记编号
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelCollectionBytravelNotesId")
    public List<travelCollection> find_travelCollectionBytravelNotesId(String travelNotesId)
    {
        return travelcollectionservice.find_travelCollectionBytravelNotesId(travelNotesId);
    }

    /**
     * 根据游记编号添加游记收藏
     * @param travelNotesId 游记编号
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_travelCollectionBytravelNotesId")
    public Map<String,Object> insert_travelCollectionBytravelNotesId(String travelNotesId, HttpSession session)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        travelCollection t=new travelCollection();
        t.setTravelCollectionId(Encryption.getUUID());
        t.setTravelNotesId(travelNotesId);
        t.setUserId(user.getUserId());
        if(0<travelcollectionservice.find_find_travelCollectionCountBytravelNotesIdAnduserId(travelNotesId,user.getUserId()))
            map.put("result","exist");//如果已经点赞,则反悔exist;
        else
        {
            if(0<travelcollectionservice.insert_travelCollectionBytravelNotesId(t))
                map.put("result",true);
            else
                map.put("result",false);
            map.put("travelCollection",travelcollectionservice.find_travelCollectionBytravelNotesId(travelNotesId));
        }
        return map;
    }
}
