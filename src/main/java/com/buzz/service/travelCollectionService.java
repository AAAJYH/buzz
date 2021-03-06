package com.buzz.service;

import com.buzz.dao.travelCollectionDao;
import com.buzz.entity.travelCollection;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class travelCollectionService
{
    @Resource
    private travelCollectionDao travelcollectiondao;
    /**
     * 根据游记编号查询游记收藏
     * @param travelNotesId 游记编号
     * @return
     */
    public List<travelCollection> find_travelCollectionBytravelNotesId(String travelNotesId)
    {
        return travelcollectiondao.find_travelCollectionBytravelNotesId(travelNotesId);
    }
    /**
     * 根据游记编号查询游记收藏数量
     * @param travelNotesId 游记编号
     * @return
     */
    public Integer find_travelCollectionCountBytravelNotesId(String travelNotesId)
    {
        return travelcollectiondao.find_travelCollectionCountBytravelNotesId(travelNotesId);
    }
    /**
     * 根据游记编号添加游记收藏
     * @param t
     * @return
     */
    public int insert_travelCollectionBytravelNotesId(travelCollection t)
    {
        return travelcollectiondao.insert_travelCollectionBytravelNotesId(t);
    }

    /**
     * 根据游记编号和用户编号查询游记收藏数量
     * @param travelNotesId
     * @param userId
     * @return
     */
    public Integer find_find_travelCollectionCountBytravelNotesIdAnduserId(String travelNotesId,String userId)
    {
        return travelcollectiondao.find_find_travelCollectionCountBytravelNotesIdAnduserId(travelNotesId,userId);
    }

    public Integer delete_travelCollectionBytravelCollectionId(String travelCollectionId)
    {
        return travelcollectiondao.delete_travelCollectionBytravelCollectionId(travelCollectionId);
    }
}
