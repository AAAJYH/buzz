package com.buzz.dao;

import com.buzz.entity.replyAskRespond;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface replyAskRespondDao
{
    /**
     * 通过问答编号,用户编号,状态编号查询回复问答
     * @param userId
     * @param askRespondId
     * @param stateId
     * @return
     */
    @Select("select * from replyAskRespond where userId=#{userId} and askRespondId=#{askRespondId} and stateId=#{stateId}")
    public replyAskRespond find_replyAskRespondByuserIdAndaskRespondIdAndstateId(@Param("userId")String userId, @Param("askRespondId")String askRespondId, @Param("stateId")String stateId);

    /**
     * 通过回复问答编号,回复问答头图,所属问答,回复问答内容,所属用户,状态添加
     * @param r
     * @return
     */
    @Insert({"<script>insert into replyAskRespond(replyAskRespondId<if test='null != replyHeadPhoto'>,replyHeadPhoto</if>,askRespondId,replyAskRespondContent,userId,stateId) values(#{replyAskRespondId}<if test='null != replyHeadPhoto'>,#{replyHeadPhoto}</if>,#{askRespondId},#{replyAskRespondContent},#{userId},#{stateId})</script>"})
    public int insert_replyAskRespondByaskRespondId(replyAskRespond r);
}
