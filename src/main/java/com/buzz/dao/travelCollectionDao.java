package com.buzz.dao;

import com.buzz.entity.travelCollection;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface travelCollectionDao
{
    /**
     * 根据游记编号查询游记收藏
     * @param travelNotesId 游记编号
     * @return
     */
    @Select("select * from travelCollection where travelNotesId=#{travelNotesId}")
    public List<travelCollection> find_travelCollectionBytravelNotesId(@Param("travelNotesId")String travelNotesId);

    /**
     * 根据游记编号添加游记收藏
     * @param t
     * @return
     */
    @Insert("insert into travelCollection(travelCollectionId,userId,travelNotesId) values(#{travelCollectionId},#{userId},#{travelNotesId})")
    public int insert_travelCollectionBytravelNotesId(travelCollection t);
}
