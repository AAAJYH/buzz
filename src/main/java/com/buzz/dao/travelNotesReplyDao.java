package com.buzz.dao;

import com.buzz.entity.travelNotesReply;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface travelNotesReplyDao
{
    /**
     * 根据游记编号查询游记回复
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return
     */
    @Select("select * from travelNotesReply where travelNotesId=#{travelNotesId} and stateId=#{stateId}")
    public List<travelNotesReply> find_travelNotesReplyBytravelNotesIdAndstateId(@Param("travelNotesId") String travelNotesId,@Param("stateId")String stateId);

    /**
     * 根据游记回复编号查询游记回复
     * @param travelNotesReplyId 游记回复编号
     * @return
     */
    @Select("select * from travelNotesReply where travelNotesReplyId=#{travelNotesReplyId}")
    public travelNotesReply find_travelNotesReplyBytravelNotesReplyId(@Param("travelNotesReplyId")String travelNotesReplyId);

    /**
     * 根据游记编号查询游记回复数量
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return
     */
    @Select("select count(travelNotesReplyId) from travelNotesReply where travelNotesId=#{travelNotesId} and stateId=#{stateId}")
    public Integer find_travelNotesReply_CountBytravelNotesIdAndstateId(@Param("travelNotesId") String travelNotesId,@Param("stateId")String stateId);

    /**
     * 添加游记回复
     * @param t
     * @return
     */
    @Insert({"<script>insert into travelNotesReply(travelNotesReplyId,travelNotesId,userId<if test='null!=travelNotesReplyIdReply'>,travelNotesReplyIdReply</if>,replyContent,stateId) values(#{travelNotesReplyId},#{travelNotesId},#{userId}<if test='null!=travelNotesReplyIdReply'>,#{travelNotesReplyIdReply}</if>,#{replyContent},#{stateId})</script>"})
    public Integer insert_travelNotesReply(travelNotesReply t);

    /**
     * 根据游记评论编号修改状态评论
     * @param travelNotesReplyId 游记评论编号
     * @param stateId 状态
     * @return
     */
    @Update("update travelNotesReply set stateId=#{stateId} where travelNotesReplyId=#{travelNotesReplyId}")
    public Integer delete_travelNotesReplyBytravelNotesReplyId(@Param("travelNotesReplyId") String travelNotesReplyId,@Param("stateId") String stateId);
}
