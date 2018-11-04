package com.buzz.service;

import com.alibaba.fastjson.JSON;
import com.buzz.dao.travelNotesDao;
import com.buzz.entity.travelNotes;
import com.buzz.entity.travelNotesContent;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

@Service
public class travelNotesService {
    @Resource
    private travelNotesDao travelnotesdao;

    /**
     * 根据用户编号查询和状态查询游记
     *
     * @param userId  用户编号
     * @param stateIds 状态
     * @return 数量
     */
    public int find_travelNotes_NumberByuserId(String userId, String... stateIds) {
        return travelnotesdao.find_travelNotes_NumberByuserId(userId, stateIds);
    }

    /**
     * 根据用户编号和查询游记
     *
     * @param userId  用户编号
     * @param stateIds 状态编号
     * @return 数据集合
     */
    public List<travelNotes> find_travelNotes_ByuserId(String userId, String... stateIds) {
        return travelnotesdao.find_travelNotes_ByuserId(userId, stateIds);
    }

    /**
     * 根据游记编号查询游记
     *
     * @param travelNotesId 游记编号
     * @return 游记实体对象
     */
    public travelNotes find_travelNotes_travelNotesId(String travelNotesId) {
        return travelnotesdao.find_travelNotes_travelNotesId(travelNotesId);
    }

    /**
     * 根据游记编号修改游记头图
     *
     * @param travelNotesId        游记编号
     * @param travelNotesheadPhoto 游记头图
     * @return 受影响行数
     */
    public int update_travelNotesheadPhoto_BytravelNotesId(String travelNotesId, String travelNotesheadPhoto) {
        return travelnotesdao.update_travelNotesheadPhoto_BytravelNotesId(travelNotesId, travelNotesheadPhoto);
    }

    /**
     * 根据游记编号修改游记音乐名称
     *
     * @param travelNotesId       游记编号
     * @param backgroundMusicName 游记音乐名称
     * @return 受影响行数
     */
    public int update_backgroundMusicName_BytravelNotesId(String travelNotesId, String backgroundMusicName)
    {
        return travelnotesdao.update_backgroundMusicName_BytravelNotesId(travelNotesId,backgroundMusicName);
    }
    /**
     * 根据游记编号修改游记音乐名称,游记音乐
     * @param travelNotesId 游记编号
     * @param backgroundMusicName 游记音乐名称
     * @param backgroundMusic 游记音乐
     * @return 受影响行数
     */
    public int update_backgroundMusicAndName_BytravelNotesId(String travelNotesId,String backgroundMusicName,String backgroundMusic)
    {
        return travelnotesdao.update_backgroundMusicAndName_BytravelNotesId(travelNotesId,backgroundMusicName,backgroundMusic);
    }

    /**
     * 根据游记编号修改游记标题和游记内容
     * @param travelNotesId 游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent 游记内容
     * @return 受影响行数
     */
    public int update_travelNotesContentAndheadline_BytravelNotesId(String travelNotesId,String travelNotesheadline,String travelNotesContent)
    {
        return travelnotesdao.update_travelNotesContentAndheadline_BytravelNotesId(travelNotesId,travelNotesheadline,travelNotesContent);
    }

    /**
     * 根据游记编号修改游记标题、游记内容、游记状态
     * @param travelNotesId 游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent 游记内容
     * @param stateId 游记状态
     * @return 受影响行数
     */
    public int update_travelNotesContentAndheadlineAndstate_BytravelNotesId(String travelNotesId,String travelNotesheadline,String travelNotesContent,String stateId)
    {
        return travelnotesdao.update_travelNotesContentAndheadlineAndstate_BytravelNotesId(travelNotesId,travelNotesheadline,travelNotesContent,stateId);
    }
    //将游记内容转换为json字符串,删除之前保存json字符串的txt文件
    public travelNotes format_travelNotesContents(travelNotes travelnotes,String path) throws IOException
    {
        String travelNotesContents=null;
        if(null!=travelnotes) {
            if (null != travelnotes.getTravelNotesContent() && !"".equals(travelnotes.getTravelNotesContent())) {
                File file = new File(path + "/" + travelnotes.getTravelNotesContent());
                String content = "";
                StringBuffer sb = new StringBuffer();
                BufferedReader reader = new BufferedReader(new FileReader(file));
                while (null != content) {
                    content = reader.readLine();
                    if (null == content)
                        break;
                    sb.append(content);
                }
                reader.close();
                travelNotesContents = sb.toString();
            }
            travelnotes.setTravelNotesContents(JSON.parseArray(travelNotesContents, travelNotesContent.class));
        }
        return travelnotes;
    }
    public void delete_travelNotesContentFile(travelNotes travelnotes,String path)
    {
        if(null!=travelnotes)//判断之前时候有游记内容,如果有删除
        {
            if(null!=travelnotes.getTravelNotesContent()&&!"".equals(travelnotes.getTravelNotesContent()))
            {
                File delete_file=new File(path+"/"+travelnotes.getTravelNotesContent());
                if(delete_file.exists())
                {
                    delete_file.delete();
                }
            }
        }
    }
    /**
     * 根据游记编号修改游记所属城市
     * @param travelNotesId 游记编号
     * @param cityId 所属城市
     * @return 受影响行数
     */
    public int update_travelNotes_cityId_BytravelNotesId(String travelNotesId,String cityId)
    {
        return travelnotesdao.update_travelNotes_cityId_BytravelNotesId(travelNotesId,cityId);
    }
    /**
     * 根据游记编号修改状态
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return 受影响行数
     */
    public int update_travelNotes_stateId_BytravelNotesId(String travelNotesId,String stateId)
    {
        return travelnotesdao.update_travelNotes_stateId_BytravelNotesId(travelNotesId,stateId);
    }

    /**
     * 根据游记编号修改状态,修改旧的状态
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return 受影响行数
     */
    public int update_travelNotes_stateId_oldstateId_BytravelNotesId(String travelNotesId,String stateId)
    {
        return travelnotesdao.update_travelNotes_stateId_oldstateId_BytravelNotesId(travelNotesId,stateId);
    }
    /**
     * 添加新的游记
     * @return 受影响行数
     */
    public int insert_travelNotes(travelNotes t)
    {
        return travelnotesdao.insert_travelNotes(t);
    }

    /**
     * 添加浏览记录
     * @param travelNotesId
     * @return
     */
    public Integer add_travelNotes_browsingHistoryBytravelNotesId(String travelNotesId)
    {
        return travelnotesdao.add_travelNotes_browsingHistoryBytravelNotesId(travelNotesId);
    }

    /**
     * 根据城市编号查询游记
     * @param cityId
     * @return
     */
    public List<travelNotes> find_travelNotesBycityIdAndstaticId(Integer pageIndex,String cityId,String...stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return travelnotesdao.find_travelNotesBycityId(cityId,stateIds);
    }
    /**
     * 根据城市编号查询游记
     * @param cityId
     * @return
     */
    public List<travelNotes> find_travelNotesBycityIdAndstaticIdAndreleaseTimedesc(Integer pageIndex,String cityId,String...stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return travelnotesdao.find_travelNotesBycityIdAndreleaseTimedesc(cityId,stateIds);
    }
    /**
     * 根据城市编号查询游记总数
     * @param cityId
     * @param stateIds
     * @return
     */
    public Integer find_travelNotesCountBycityIdAndstaticId(String cityId,String...stateIds)
    {
        return travelnotesdao.find_travelNotesCountBycityIdAndstaticId(cityId,stateIds);
    }

    /**
     * 根据点赞获取热门游记
     * @return
     */
    public travelNotes find_travelNotesByHot()
    {
        return travelnotesdao.find_travelNotesByHot();
    }
}
