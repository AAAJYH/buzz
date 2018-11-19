package com.buzz.dao;

import com.buzz.entity.replyAskRespondTop;
import org.apache.ibatis.annotations.*;

@Mapper
public interface replyAskRespondTopDao
{
    /**
     * 添加顶
     * @param rart
     * @return
     */
    @Insert("insert into replyAskRespondTop(replyAskRespondTopId,replyAskRespondId,userId) values(#{replyAskRespondTopId},#{replyAskRespondId},#{userId})")
    public int insert_replyAskRespondTop(replyAskRespondTop rart);

    /**
     * 根据回复问答编号查询顶的数量
     * @param replyAskRespondId
     * @return
     */
    @Select("select count(replyAskRespondTopId) from replyAskRespondTop where replyAskRespondId=#{replyAskRespondId}")
    public Integer find_replyAskRespondTop_CountByreplyAskRespondId(@Param("replyAskRespondId")String replyAskRespondId);

    /**
     * 根据回复问答编号和用户编号查询顶的数量
     * @param replyAskRespondId
     * @return
     */
    @Select("select count(replyAskRespondTopId) from replyAskRespondTop where replyAskRespondId=#{replyAskRespondId} and userId=#{userId}")
    public Integer find_replyAskRespondTop_CountByreplyAskRespondIdAnduserId(@Param("replyAskRespondId")String replyAskRespondId,@Param("userId")String userId);

    /**
     * 通过用户和状态获取收藏回复问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    @Select({"<script>select count(rak.replyAskRespondId) from replyAskRespond rak where rak.stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach> and rak.replyAskRespondId in (select rrt.replyAskRespondId from replyAskRespondTop rrt where rrt.userId=#{userId})</script>"})
    public Integer find_replyAskRespondTop_CountByuserIdAndstateId(@Param("userId")String userId,@Param("stateIds")String... stateIds);

    /**
     * 根据收藏回复问答编号删除
     * @param replyAskRespondTopId
     * @return
     */
    @Delete("delete from replyAskRespondTop where replyAskRespondTopId=#{replyAskRespondTopId}")
    public Integer delete_replyAskRespondTopByreplyAskRespondTopId(@Param("replyAskRespondTopId")String replyAskRespondTopId);
}
