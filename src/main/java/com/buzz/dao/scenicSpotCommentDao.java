package com.buzz.dao;

import com.buzz.entity.scenicSpotComment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/10/27 1:28
 * 景点评论数据库访问层
 */

@Mapper
public interface scenicSpotCommentDao {

    //添加评论
    @Insert("insert into scenicSpotComment(scenicSpotCommentId,content,pictures,userId,userName,userPicture,commentTime,start,scenicSpotId) values(#{s.scenicSpotCommentId},#{s.content},#{s.pictures},#{s.userId},#{s.userName},#{s.userPicture},#{s.commentTime},#{s.start},#{s.scenicSpotId})")
    public int addComment(@Param("s") scenicSpotComment scenicSpotComment);

    //查询景点评论
    @Select("select * from scenicSpotComment where scenicSpotId=#{scenicSpotId} order by commentTime desc")
    public  List<scenicSpotComment> queryScenicSpotComment(String scenicSpotId);

}
