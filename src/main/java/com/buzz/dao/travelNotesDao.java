package com.buzz.dao;

import com.buzz.entity.travelNotes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface travelNotesDao
{
    /**
     * 根据用户编号和状态查游记数量
     * @param userId 用户编号
     * @param stateId 状态
     * @return 返回游记数量
     */
    @Select("select count(*) from travelNotes where userId=#{userId} and stateId=#{stateId}")
    public Integer find_travelNotes_NumberByuserId(@Param("userId")String userId,@Param("stateId")String stateId);
    /**
     * 根据用户编号和查询游记
     * @param userId 用户编号
     * @param stateId 状态编号
     * @return 数据集合
     */
    @Select("select * from travelNotes where userId=#{userId} and stateId=#{stateId}")
    public List<travelNotes> find_travelNotes_ByuserId(@Param("userId")String userId,@Param("stateId")String stateId);

    /**
     * 根据游记编号查询游记
     * @param travelNotesId 游记编号
     * @return 游记实体对象
     */
    @Select("select * from travelNotes where travelNotesId=#{travelNotesId}")
    public travelNotes find_travelNotes_travelNotesId(@Param("travelNotesId")String travelNotesId);

    /**
     * 根据游记编号修改游记头图
     * @param travelNotesId 游记编号
     * @param travelNotesheadPhoto 游记头图
     * @return 受影响行数
     */
    @Update("update travelNotes set travelNotesheadPhoto=#{travelNotesheadPhoto} where travelNotesId=#{travelNotesId}")
    public int update_travelNotesheadPhoto_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("travelNotesheadPhoto")String travelNotesheadPhoto);

    /**
     * 根据游记编号修改游记音乐名称
     * @param travelNotesId 游记编号
     * @param backgroundMusicName 游记音乐名称
     * @return 受影响行数
     */
    @Update("update travelNotes set backgroundMusicName=#{backgroundMusicName} where travelNotesId=#{travelNotesId}")
    public int update_backgroundMusicName_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("backgroundMusicName")String backgroundMusicName);

    /**
     * 根据游记编号修改游记音乐名称,游记音乐
     * @param travelNotesId 游记编号
     * @param backgroundMusicName 游记音乐名称
     * @param backgroundMusic 游记音乐
     * @return 受影响行数
     */
    @Update("update travelNotes set backgroundMusicName=#{backgroundMusicName},backgroundMusic=#{backgroundMusic} where travelNotesId=#{travelNotesId}")
    public int update_backgroundMusicAndName_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("backgroundMusicName")String backgroundMusicName,@Param("backgroundMusic")String backgroundMusic);

    /**
     * 根据游记编号修改游记标题和游记内容
     * @param travelNotesId 游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent 游记内容
     * @return 受影响行数
     */
    @Update("update travelNotes set travelNotesheadline=#{travelNotesheadline},travelNotesContent=#{travelNotesContent} where travelNotesId=#{travelNotesId}")
    public int update_travelNotesContentAndheadline_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("travelNotesheadline")String travelNotesheadline,@Param("travelNotesContent")String travelNotesContent);

    /**
     * 根据游记编号修改游记标题、游记内容、游记状态
     * @param travelNotesId 游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent 游记内容
     * @param stateId 游记状态
     * @return 受影响行数
     */
    @Update("update travelNotes set travelNotesheadline=#{travelNotesheadline},travelNotesContent=#{travelNotesContent},stateId=#{stateId} where travelNotesId=#{travelNotesId}")
    public int update_travelNotesContentAndheadlineAndstate_BytravelNotesId(@Param("travelNotesId") String travelNotesId, @Param("travelNotesheadline") String travelNotesheadline, @Param("travelNotesContent") String travelNotesContent, @Param("stateId") String stateId);
}
