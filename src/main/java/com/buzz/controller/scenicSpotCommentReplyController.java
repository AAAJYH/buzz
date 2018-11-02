package com.buzz.controller;

import com.buzz.entity.scenicSpotCommentReply;
import com.buzz.entity.users;
import com.buzz.service.scenicSpotCommentReplyService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.UUID;

/**
 * @Author: jyh
 * @Date: 2018/10/27 13:00
 * 景点评论回复控制层
 */

@Controller
@RequestMapping("/scenicSpotCommentReplyController")
public class scenicSpotCommentReplyController {

    @Resource
    scenicSpotCommentReplyService scenicSpotCommentReplyService;

    @RequestMapping("/addScenicSpotCommentReply")
    @ResponseBody
    public int addScenicSpotCommentReply(String content, String replayUserName, String replayUserId, String scenicSpotCommentId, HttpSession session){
        String id= UUID.randomUUID().toString(); //id
        String userName=""; //评论用户姓名
        String userId=""; //评论用户id
        if(session.getAttribute("user")!=null){
            users users= (users) session.getAttribute("user");
            userId=users.getUserId();
            userName=users.getUserName();
        }
        Timestamp currentTime= new Timestamp(System.currentTimeMillis()); //当前时间
        int rs=scenicSpotCommentReplyService.addScenicSpotCommentReply(new scenicSpotCommentReply(id,userName,userId,replayUserName,replayUserId,content,currentTime,scenicSpotCommentId));
        return rs;
    }

}
