package com.buzz.controller;

import com.buzz.dao.scenicSpotCommentDao;
import com.buzz.entity.scenicSpotComment;
import com.buzz.entity.scenicSpotCommentReply;
import com.buzz.entity.users;
import com.buzz.service.scenicSpotCommentReplyService;
import com.buzz.service.scenicSpotCommentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.*;

/**
 * @Author: jyh
 * @Date: 2018/10/27 1:34
 * 景点评论控制层
 */

@Controller
@RequestMapping("/scenicSpotCommentController")
public class scenicSpotCommentController {

    @Resource
    scenicSpotCommentService scenicSpotCommentService;

    @Resource
    scenicSpotCommentReplyService scenicSpotCommentReplyService;

    /**
     * 发表评论
     * @param rank 星星数
     * @param content 评论内容
     * @param imgs 评论图片
     * @param session 获取用户信息
     * @return 返回添加结果
     */
    @RequestMapping("/scenicSpotAddComment")
    @ResponseBody
    public int scenicSpotAddComment(Integer rank, String content, String imgs, HttpSession session,String scenicSpotId){
        String id= UUID.randomUUID().toString(); //id
        String userId=""; //用户id
        String userName=""; //用户姓名
        String userPic=""; //用户头像
        if(session.getAttribute("user")!=null){
            users users= (users) session.getAttribute("user");
            userId=users.getUserId();
            userName=users.getUserName();
            userPic=users.getPhoto();
        }
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //当前时间戳
        int rs=scenicSpotCommentService.addComment(new scenicSpotComment(id,content,imgs,userId,userName,userPic,currentTime,rank,scenicSpotId));
        return rs;
    }

    @RequestMapping("/queryScenicsPotComment")
    @ResponseBody
    public List<Map<String,Object>> queryScenicsPotComment(Model model,String scenicSpotId){
        //评论集合
        List<Map<String,Object>> mapList=new ArrayList<Map<String,Object>>();
        //评论总数
        Integer commentSum=0;
        //查询景点评论
        List<scenicSpotComment> spotCommentList= scenicSpotCommentService.queryScenicSpotCommentAll(scenicSpotId);
        for (scenicSpotComment s:spotCommentList) {
            commentSum+=1;
            Map<String,Object> map=new HashMap<String,Object>();
            map.put("scenicSpotComment",s);
            //查询评论的回复
            List<scenicSpotCommentReply> scenicSpotCommentReplyList=scenicSpotCommentReplyService.queryScenicSpotCommentReply(s.getScenicSpotCommentId());
            map.put("reply",scenicSpotCommentReplyList);
            mapList.add(map);
        }
        Map map=new HashMap<String,Object>();
        map.put("commentSum",commentSum);
        mapList.add(map);
        return mapList;
    }

}
