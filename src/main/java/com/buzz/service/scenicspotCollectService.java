package com.buzz.service;

import com.buzz.dao.scenicspotCollectDao;
import com.buzz.entity.scenicspotCollect;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 17:53
 * 景点收藏业务层
 */

@Service
public class scenicspotCollectService {

    @Resource
    scenicspotCollectDao scenicspotCollectDao;

    //添加数据
    public int addScenicspotCollect(scenicspotCollect scenicspotCollect){
        return scenicspotCollectDao.addScenicspotCollect(scenicspotCollect);
    }

}
