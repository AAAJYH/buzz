package com.buzz.dao;

import com.buzz.entity.replyAskRespondTop;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
}
