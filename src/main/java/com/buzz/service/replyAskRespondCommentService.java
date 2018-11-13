package com.buzz.service;

import com.buzz.dao.replyAskRespondCommentDao;
import com.buzz.entity.replyAskRespondComment;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class replyAskRespondCommentService
{
    @Resource
    private replyAskRespondCommentDao replyaskrespondcommentdao;
    /**
     * 通过回复问答编号和状态查询评论
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    public List<replyAskRespondComment> find_replyAskRespondCommentByreplyAskRespondIdAndstateId(String replyAskRespondId,String stateId)
    {
        return replyaskrespondcommentdao.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(replyAskRespondId,stateId);
    }

    /**
     * 通过评论编号查询评论
     * @param replyAskRespondCommentId
     * @return
     */
    public replyAskRespondComment find_replyAskRespondCommentByreplyAskRespondCommentId(String replyAskRespondCommentId)
    {
        return replyaskrespondcommentdao.find_replyAskRespondCommentByreplyAskRespondCommentId(replyAskRespondCommentId);
    }

    /**
     * 添加回复评论
     * @param rasc
     * @return
     */
    public int insert_replyAskRespondComment(replyAskRespondComment rasc)
    {
        return replyaskrespondcommentdao.insert_replyAskRespondComment(rasc);
    }
    /**
     * 修改问答评论状态为删除
     * @param replyAskRespondCommentId
     * @param stateId
     * @return
     */
    public int update_replyAskRespondCommentByreplyAskRespondCommentIdAndstateId(String replyAskRespondCommentId,String stateId)
    {
        return replyaskrespondcommentdao.update_replyAskRespondCommentByreplyAskRespondCommentIdAndstateId(replyAskRespondCommentId,stateId);
    }
}
