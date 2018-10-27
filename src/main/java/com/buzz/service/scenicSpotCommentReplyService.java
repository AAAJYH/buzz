package com.buzz.service;

import com.buzz.dao.scenicSpotCommentReplyDao;
import com.buzz.entity.scenicSpotCommentReply;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/27 9:51
 */

@Service
public class scenicSpotCommentReplyService {

    @Resource
    scenicSpotCommentReplyDao scenicSpotCommentReplyDao;

    //查询景点评论回复
    public List<scenicSpotCommentReply> queryScenicSpotCommentReply(String scenicSpotCommentId){
        return scenicSpotCommentReplyDao.queryScenicSpotCommentReply(scenicSpotCommentId);
    }

    //添加评论回复
    @Transactional
    public int addScenicSpotCommentReply(scenicSpotCommentReply scenicSpotCommentReply){
        return scenicSpotCommentReplyDao.addScenicSpotCommentReply(scenicSpotCommentReply);
    }


}
