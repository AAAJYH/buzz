package com.buzz.dao;

import com.buzz.entity.scenicSpotCommentReply;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/27 9:50
 * 景点评论回复数据库访问层
 */

@Mapper
public interface scenicSpotCommentReplyDao {

    //查询景点评论回复
    @Select("select * from scenicspotcommentreply where scenicSpotCommentId=#{scenicSpotCommentId} order by replyTime desc")
    public List<scenicSpotCommentReply> queryScenicSpotCommentReply(@Param("scenicSpotCommentId") String scenicSpotCommentId);

    //添加评论回复
    @Insert("insert into scenicSpotCommentReply(commentReplyId,userName,userId,replyUserName,replyUserId,replyContent,replyTime,scenicSpotCommentId) values(#{s.commentReplyId},#{s.userName},#{s.userId},#{s.replyUserName},#{s.replyUserId},#{s.replyContent},#{s.replyTime},#{s.scenicSpotCommentId})")
    public int addScenicSpotCommentReply(@Param("s") scenicSpotCommentReply scenicSpotCommentReply);

}
