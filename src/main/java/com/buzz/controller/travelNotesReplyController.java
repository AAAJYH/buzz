package com.buzz.controller;

import com.buzz.entity.travelNotesReply;
import com.buzz.entity.users;
import com.buzz.service.travelNotesReplyService;
import com.buzz.service.usersService;
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
@RequestMapping("travelNotesReplyController")
public class travelNotesReplyController
{
    @Resource
    private travelNotesReplyService travelnotesreplyservice;
    @Resource
    private usersService  usersservice;

    /**
     * 根据页下标,游记回复编号获取游记回复
     * @param pageIndex
     * @param travelNotesId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesReplyByPaging")
    public Map<String,Object> find_travelNotesReplyByPaging(int pageIndex,String travelNotesId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("travelNotesReplyCount",travelnotesreplyservice.find_travelNotesReply_CountBytravelNotesIdAndstateId(travelNotesId,"0ee26211-3ae8-48b7-973f-8488bfe837d6"));
        map.put("currentIndex",pageIndex);
        List<travelNotesReply> list=travelnotesreplyservice.find_travelNotesReplyBytravelNotesIdAndstateId(travelNotesId,pageIndex,100,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
        if(null!=list&&0<list.size())
        {
            for(travelNotesReply t:list)
            {
                t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                if(null!=t.getTravelNotesReplyIdReply()&&!"".equals(t.getTravelNotesReplyIdReply()))
                {
                    t.setTravelNotesReplyReply(travelnotesreplyservice.find_travelNotesReplyBytravelNotesReplyId(t.getTravelNotesReplyIdReply()));
                    t.getTravelNotesReplyReply().setUser(usersservice.find_userByuseruserId(t.getTravelNotesReplyReply().getUserId()));
                }
            }
        }
        map.put("travelNotesReply",list);
        return map;
    }

    /**
     * 添加游记回复
     * @param travelNotesId 游记编号
     * @param travelNotesReplyIdReply 被回复游记回复
     * @param replyContent 回复内容
     * @param session 用于获取用户
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_travelNotesReply")
    public Map<String,Object>insert_travelNotesReply(String travelNotesId,String travelNotesReplyIdReply,String replyContent,HttpSession session)
    {
        users user= (users) session.getAttribute("user");
        Map<String,Object> map=new HashMap<String,Object>();
        travelNotesReply travelnotesreply=new travelNotesReply();
        travelnotesreply.setTravelNotesReplyId(Encryption.getUUID());
        travelnotesreply.setTravelNotesId(travelNotesId);
        travelnotesreply.setUserId(user.getUserId());
        if(null!=travelNotesReplyIdReply&&!"".equals(travelNotesReplyIdReply))
            travelnotesreply.setTravelNotesReplyIdReply(travelNotesReplyIdReply);
        travelnotesreply.setReplyContent(replyContent);
        travelnotesreply.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        if(0<travelnotesreplyservice.insert_travelNotesReply(travelnotesreply))
        {
            map.put("result",true);
            Integer travelNotesReplyCount=travelnotesreplyservice.find_travelNotesReply_CountBytravelNotesIdAndstateId(travelNotesId,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
            map.put("travelNotesReplyCount",travelNotesReplyCount);
            int totalPages=0;
            if(travelNotesReplyCount%100>0)
                totalPages=travelNotesReplyCount/100+1;
            else
                totalPages=travelNotesReplyCount/100;
            map.put("currentIndex",totalPages);
            List<travelNotesReply> list=travelnotesreplyservice.find_travelNotesReplyBytravelNotesIdAndstateId(travelNotesId,totalPages,100,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
            if(null!=list&&0<list.size())
            {
                for(travelNotesReply t:list)
                {
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                    if(null!=t.getTravelNotesReplyIdReply()&&!"".equals(t.getTravelNotesReplyIdReply()))
                    {
                        t.setTravelNotesReplyReply(travelnotesreplyservice.find_travelNotesReplyBytravelNotesReplyId(t.getTravelNotesReplyIdReply()));
                        t.getTravelNotesReplyReply().setUser(usersservice.find_userByuseruserId(t.getTravelNotesReplyReply().getUserId()));
                    }
                }
            }
            map.put("travelNotesReply",list);
        }
        else
            map.put("result",false);
        return map;
    }

    /**
     * 根据游记评论编号删除评论
     * @param travelNotesReplyId 游记评论编号
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_travelNotesReplyBytravelNotesReplyId")
    public boolean delete_travelNotesReplyBytravelNotesReplyId(String travelNotesReplyId)
    {
        if(0<travelnotesreplyservice.delete_travelNotesReplyBytravelNotesReplyId(travelNotesReplyId,"ac618998-ffe3-4300-a391-cd581f74078c"))
            return true;
        else
            return false;
    }
}
