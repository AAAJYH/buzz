package com.buzz.controller;

import com.buzz.entity.replyAskRespond;
import com.buzz.entity.replyAskRespondComment;
import com.buzz.entity.users;
import com.buzz.service.replyAskRespondCommentService;
import com.buzz.service.replyAskRespondService;
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
@RequestMapping("replyAskRespondCommentController")
public class replyAskRespondCommentController
{
    @Resource
    private replyAskRespondCommentService replyaskrespondcommentservice;
    @Resource
    private usersService usersservice;
    @Resource
    private replyAskRespondService replyaskrespondservice;

    /**
     * 添加回复评论
     * @param CommentContent
     * @param replyAskRespondId
     * @param parentRespondCommentId
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_replyAskRespondComment")
    public Map<String,Object> insert_replyAskRespondComment(String CommentContent, String replyAskRespondId, String parentRespondCommentId, HttpSession session)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        if(null==parentRespondCommentId||"".equals(parentRespondCommentId))
            parentRespondCommentId=null;
        replyAskRespondComment rarc=new replyAskRespondComment();
        rarc.setReplyAskRespondCommentId(Encryption.getUUID());
        rarc.setCommentContent(CommentContent);
        rarc.setReplyAskRespondId(replyAskRespondId);
        rarc.setParentRespondCommentId(parentRespondCommentId);
        rarc.setUserId(user.getUserId());
        rarc.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        if(0<replyaskrespondcommentservice.insert_replyAskRespondComment(rarc))
        {
            map.put("result",true);
            replyAskRespond rar=replyaskrespondservice.find_replyAskRespondByreplyAskRespondIdAndstateId(replyAskRespondId,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
            if(null!=rar)
            {
                rar.setUser(usersservice.find_userByuseruserId(rar.getUserId()));
                List<replyAskRespondComment> replyAskRespondComments = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(replyAskRespondId, "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if (null != replyAskRespondComments && 0 < replyAskRespondComments.size()) {
                    for (replyAskRespondComment r : replyAskRespondComments) {
                        if (null != r.getParentRespondCommentId() && !"".equals(r.getParentRespondCommentId())) {
                            replyAskRespondComment parentrask=replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondCommentId(r.getParentRespondCommentId());
                            parentrask.setUser(usersservice.find_userByuseruserId(parentrask.getUserId()));
                            r.setParentrespondcomment(parentrask);
                        }
                        r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                    }
                    rar.setReplyaskrespondcomments(replyAskRespondComments);
                }
                map.put("replyAskRespond",rar);
            }
        }
        else
            map.put("result",false);
        return  map;
    }
    @ResponseBody
    @RequestMapping("delete_replyAskRespondCommentByreplyAskRespondCommentId")
    public boolean delete_replyAskRespondCommentByreplyAskRespondCommentId(String replyAskRespondCommentId)
    {
        if(0<replyaskrespondcommentservice.update_replyAskRespondCommentByreplyAskRespondCommentIdAndstateId(replyAskRespondCommentId,"ac618998-ffe3-4300-a391-cd581f74078c"))
            return true;
        else
            return false;
    }
}
