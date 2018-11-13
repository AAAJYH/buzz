package com.buzz.service;

import com.buzz.dao.replyAskRespondTopDao;
import com.buzz.entity.replyAskRespondTop;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class replyAskRespondTopService
{
    @Resource
    private replyAskRespondTopDao replyaskrespondtopdao;
    /**
     * 添加顶
     * @param rart
     * @return
     */
    public int insert_replyAskRespondTop(replyAskRespondTop rart)
    {
        return replyaskrespondtopdao.insert_replyAskRespondTop(rart);
    }

    /**
     * 根据回复问答编号查询顶的数量
     * @param replyAskRespondId
     * @return
     */
    public Integer find_replyAskRespondTop_CountByreplyAskRespondId(String replyAskRespondId)
    {
        return replyaskrespondtopdao.find_replyAskRespondTop_CountByreplyAskRespondId(replyAskRespondId);
    }

    /**
     * 根据回复问答编号和用户编号查询顶的数量
     * @param replyAskRespondId
     * @return
     */
    public Integer find_replyAskRespondTop_CountByreplyAskRespondIdAnduserId(String replyAskRespondId,String userId)
    {
        return replyaskrespondtopdao.find_replyAskRespondTop_CountByreplyAskRespondIdAnduserId(replyAskRespondId,userId);
    }
}
