package com.buzz.controller;

import com.buzz.entity.replyAskRespondTop;
import com.buzz.entity.users;
import com.buzz.service.replyAskRespondTopService;
import com.buzz.utils.Encryption;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("replyAskRespondTopController")
public class replyAskRespondTopController
{
    @Resource
    private replyAskRespondTopService replyaskrespondtopservice;

    /**
     * 添加顶
     * @param replyAskRespondId
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_replyAskRespondTop")
    public Map<String,Object> insert_replyAskRespondTop(String replyAskRespondId, HttpSession session) {
        Map<String, Object> map = new HashMap<String, Object>();
        users user = (users) session.getAttribute("user");
        Integer count = replyaskrespondtopservice.find_replyAskRespondTop_CountByreplyAskRespondIdAnduserId(replyAskRespondId, user.getUserId());
        if (null != count && 0 < count)
            map.put("result", "exists");
        else
        {
            replyAskRespondTop rat=new replyAskRespondTop();
            rat.setReplyAskRespondTopId(Encryption.getUUID());
            rat.setReplyAskRespondId(replyAskRespondId);
            rat.setUserId(user.getUserId());
            if(0<replyaskrespondtopservice.insert_replyAskRespondTop(rat))
            {
                Integer counts=replyaskrespondtopservice.find_replyAskRespondTop_CountByreplyAskRespondId(replyAskRespondId);
                map.put("counts",counts);
                map.put("result",true);
            }
            else
                map.put("result",false);
        }
        return map;
    }
}
