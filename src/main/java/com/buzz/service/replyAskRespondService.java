package com.buzz.service;

import com.buzz.dao.replyAskRespondDao;
import com.buzz.entity.replyAskRespond;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class replyAskRespondService
{
    @Resource
    private replyAskRespondDao replyaskresponddao;

    /**
     * 通过问答编号,用户编号,状态编号查询回复问答
     * @param userId
     * @param askRespondId
     * @param stateId
     * @return
     */
    public replyAskRespond find_replyAskRespondByuserIdAndaskRespondIdAndstateId(String userId, String askRespondId, String stateId)
    {
        return replyaskresponddao.find_replyAskRespondByuserIdAndaskRespondIdAndstateId(userId,askRespondId,stateId);
    }

    /**
     * 通过回复问答编号,回复问答头图,所属问答,回复问答内容,所属用户,状态添加
     * @param r
     * @return
     */
    public int insert_replyAskRespondByaskRespondId(replyAskRespond r)
    {
        return replyaskresponddao.insert_replyAskRespondByaskRespondId(r);
    }
}
