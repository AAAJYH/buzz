package com.buzz.service;

import com.buzz.dao.interestLabelDao;
import com.buzz.entity.interestLabel;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class interestLabelService
{
    @Resource
    private interestLabelDao interestlabeldao;

    /**
     * 通过状态编号查询兴趣标签
     * @param stateId
     * @return
     */
    public List<interestLabel> find_interestLabelBystateId(String stateId)
    {
        return interestlabeldao.find_interestLabelBystateId(stateId);
    }

    /**
     * 通过兴趣编号获取兴趣标签
     * @param interestLabelId
     * @return
     */
    public interestLabel find_interestLabelByinterestLabelId(String interestLabelId)
    {
        return interestlabeldao.find_interestLabelByinterestLabelId(interestLabelId);
    }

    /**
     * 通过键盘按下值和状态编号搜索
     * @param keyvalue
     * @param stateId
     * @return
     */
    public List<interestLabel> find_interestLabelBykeyvalueAndstateId(String keyvalue,String stateId)
    {
        return interestlabeldao.find_interestLabelBykeyvalueAndstateId(keyvalue,stateId);
    }
}
