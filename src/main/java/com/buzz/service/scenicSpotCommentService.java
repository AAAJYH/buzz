package com.buzz.service;

import com.buzz.dao.scenicSpotCommentDao;
import com.buzz.entity.scenicSpotComment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/27 1:32
 * 景点评论业务层
 */

@Service
public class scenicSpotCommentService {


    @Resource
    scenicSpotCommentDao scenicSpotCommentDao;

    //添加评论
    @Transactional
    public int addComment(scenicSpotComment scenicSpotComment){
        return scenicSpotCommentDao.addComment(scenicSpotComment);
    }

    //查询全部
    public List<scenicSpotComment> queryScenicSpotCommentAll(String scenicSpotId){
        return scenicSpotCommentDao.queryScenicSpotComment(scenicSpotId);
    }


}
