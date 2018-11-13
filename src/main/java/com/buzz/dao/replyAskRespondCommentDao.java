package com.buzz.dao;

import com.buzz.entity.replyAskRespondComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface replyAskRespondCommentDao
{
    /**
     * 通过回复问答编号和状态查询评论
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    @Select("select * from replyAskRespondComment where replyAskRespondId=#{replyAskRespondId} and stateId=#{stateId}")
    public List<replyAskRespondComment> find_replyAskRespondCommentByreplyAskRespondIdAndstateId(@Param("replyAskRespondId") String replyAskRespondId,@Param("stateId")String stateId);

    /**
     * 通过评论编号查询评论
     * @param replyAskRespondCommentId
     * @return
     */
    @Select("select * from replyAskRespondComment where replyAskRespondCommentId=#{replyAskRespondCommentId}")
    public replyAskRespondComment find_replyAskRespondCommentByreplyAskRespondCommentId(@Param("replyAskRespondCommentId")String replyAskRespondCommentId);

    /**
     * 添加回复评论
     * @param rasc
     * @return
     */
    @Insert({"<script>insert into replyAskRespondComment(replyAskRespondCommentId,commentContent,replyAskRespondId<if test='parentRespondCommentId !=null'>,parentRespondCommentId</if>,userId,stateId) values(#{replyAskRespondCommentId},#{commentContent},#{replyAskRespondId}<if test='parentRespondCommentId != null'>,#{parentRespondCommentId}</if>,#{userId},#{stateId})</script>"})
    public int insert_replyAskRespondComment(replyAskRespondComment rasc);

    /**
     * 修改问答评论状态为删除
     * @param replyAskRespondCommentId
     * @param stateId
     * @return
     */
    @Update("update replyAskRespondComment set stateId=#{stateId} where replyAskRespondCommentId=#{replyAskRespondCommentId}")
    public int update_replyAskRespondCommentByreplyAskRespondCommentIdAndstateId(@Param("replyAskRespondCommentId")String replyAskRespondCommentId,@Param("stateId")String stateId);
}
