package com.buzz.dao;

import com.buzz.entity.travelNotes;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface travelNotesDao
{
    /**
     * 根据用户编号和状态查游记数量
     * @param userId 用户编号
     * @param stateIds 状态
     * @return 返回游记数量
     */
    //@Select后面的括号包含大括号,使用<script>标签@Select后面大括号中的代码，每行后面使用逗号结束
    @Select({"<script>select count(*) from travelNotes where userId=#{userId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public Integer find_travelNotes_NumberByuserId(@Param("userId")String userId,@Param("stateIds")String... stateIds);
    /**
     * 根据用户编号和查询游记
     * @param userId 用户编号
     * @param stateIds 状态编号
     * @return 数据集合
     */
    @Select({"<script>select * from travelNotes where userId=#{userId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<travelNotes> find_travelNotes_ByuserId(@Param("userId")String userId,@Param("stateIds")String... stateIds);

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

    /**
     * 根据游记编号修改游记所属城市
     * @param travelNotesId 游记编号
     * @param cityId 所属城市
     * @return 受影响行数
     */
    @Update("update travelNotes set cityId=#{cityId} where travelNotesId=#{travelNotesId}")
    public int update_travelNotes_cityId_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("cityId")String cityId);

    /**
     * 根据游记编号修改状态
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return 受影响行数
     */
    @Update("update travelNotes set stateId=#{stateId} where travelNotesId=#{travelNotesId}")
    public int update_travelNotes_stateId_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("stateId")String stateId);

    /**
     * 根据游记编号修改状态,修改旧的状态
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return 受影响行数
     */
    @Update("update travelNotes set oldstateId=stateId,stateId=#{stateId} where travelNotesId=#{travelNotesId}")
    public int update_travelNotes_stateId_oldstateId_BytravelNotesId(@Param("travelNotesId")String travelNotesId,@Param("stateId")String stateId);
    /**
     * 添加新的游记
     * @return 受影响行数
     */
    @Insert("insert into travelNotes(travelNotesId,userId,browsingHistory,stateId) values(#{travelNotesId},#{userId},#{browsingHistory},#{stateId})")
    public int insert_travelNotes(travelNotes t);

    /**
     * 添加浏览记录
     * @param travelNotesId
     * @return
     */
    @Update("update travelNotes set browsingHistory=browsingHistory+1 where travelNotesId=#{travelNotesId}")
    public Integer add_travelNotes_browsingHistoryBytravelNotesId(@Param("travelNotesId") String travelNotesId);
}
