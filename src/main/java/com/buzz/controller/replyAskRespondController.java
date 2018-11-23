package com.buzz.controller;

import com.buzz.entity.askRespond;
import com.buzz.entity.replyAskRespond;
import com.buzz.entity.replyAskRespondComment;
import com.buzz.entity.users;
import com.buzz.service.*;
import com.buzz.utils.Encryption;
import com.buzz.utils.Upload;
import org.apache.shiro.authz.annotation.RequiresUser;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("replyAskRespondController")
public class replyAskRespondController {
    @Resource
    private replyAskRespondService replyaskrespondservice;
    @Resource
    private usersService usersservice;
    @Resource
    private askRespondService askrespondservice;
    @Resource
    private interestLabelService interestlabelservice;
    @Resource
    private cityService cityservice;
    @Resource
    private replyAskRespondCommentService replyaskrespondcommentservice;
    @Resource
    private replyAskRespondTopService replyaskrespondtopservice;

    @ResponseBody
    @RequestMapping("insert_replyAskRespondByaskRespondId")
    public Map<String, Object> insert_replyAskRespondByaskRespondId(String askRespondId, String replyHeadPhoto, String replyAskRespondContent, String currentUserId, String replyBrief) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        replyAskRespond rask = new replyAskRespond();
        rask.setReplyAskRespondId(Encryption.getUUID());
        rask.setAskRespondId(askRespondId);
        if (null == replyHeadPhoto || "".equals(replyHeadPhoto))
            replyHeadPhoto = null;
        rask.setReplyHeadPhoto(replyHeadPhoto);
        rask.setUserId(currentUserId);
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String newfilename = "upload/replyAskRespond/replyAskRespondContent/" + Encryption.getUUID() + "." + "txt";
        rask.setReplyAskRespondContent(newfilename);
        rask.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        rask.setOptimumAnswer("false");
        rask.setReplyBrief(replyBrief);
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(replyAskRespondContent.getBytes());
            if (file.exists()) {
                if (0 < replyaskrespondservice.insert_replyAskRespondByaskRespondId(rask)) {
                    map.put("replyAskRespondCount", replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(currentUserId, "0ee26211-3ae8-48b7-973f-8488bfe837d6", "2130f38e-48b2-4e7e-a4cf-120aa3a149af"));
                    askRespond ask = askrespondservice.find_askRespondByaskRespondId(askRespondId, "0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
                    if (null != ask) {
                        List<askRespond> list = null;
                        if (null != ask.getInterestLabelId() && !"".equals(ask.getInterestLabelId())) {
                            map.put("by", "interestLabelId");
                            list = askrespondservice.find_askRespondByinterestLabelIdAndstateId(1, ask.getInterestLabelId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
                        } else if (null != ask.getCityId() && !"".equals(ask.getCityId())) {
                            map.put("by", "cityId");
                            list = askrespondservice.find_askRespondBycityIdAndstateId(1, ask.getCityId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
                        } else {
                            map.put("by", "askRespondTitle");
                            list = askrespondservice.find_askRespondByaskRespondTitleAndstateIdAndpageIndex(1, ask.getAskRespondTitle(), "0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
                            if (null == list || 0 >= list.size()) {
                                map.put("by", "All");
                                list = askrespondservice.find_askRespondBystateId(1, "0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
                            }
                        }
                        if (null != list && 0 < list.size()) {
                            for (askRespond a : list) {
                                String by = map.get("by").toString();
                                if (by.equals("cityId") && null != a.getCityId() && !"".equals(a.getCityId())) {
                                    a.setCity(cityservice.byCityIdQuery(a.getCityId()));
                                } else if (by.equals("interestLabelId") && null != a.getInterestLabelId() && !"".equals(a.getInterestLabelId())) {
                                    a.setInterestlabel(interestlabelservice.find_interestLabelByinterestLabelId(a.getInterestLabelId()));
                                }
                                if (null != a.getUserId() && !"".equals(a.getUserId())) {
                                    a.setUser(usersservice.find_userByuseruserId(a.getUserId()));
                                }
                            }
                        }
                        map.put("askResponds", list);
                        if (ask.getStateId().equals("0ee26211-3ae8-48b7-973f-8488bfe837d6"))
                            askrespondservice.update_stateIdByaskRespondId(askRespondId, "79ce7fee-9393-4ab8-88a0-306d7b2c9d22");
                    }
                    map.put("result", true);
                } else {
                    file.delete();
                    map.put("result", false);
                }
            } else
                map.put("result", false);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", false);
        } finally {
            if (null != fos) {
                fos.flush();
                fos.close();
            }
        }
        return map;
    }

    @ResponseBody
    @RequestMapping("load_replyAskRespondByaskRespondIdAndIndex")
    public Map<String, Object> load_replyAskRespondByaskRespondIdAndIndex(String askRespondId, Integer pageIndex, String currentUserId) throws IOException {
        if (null == currentUserId || "".equals(currentUserId))
            currentUserId = null;
        Map<String, Object> map = new HashMap<String, Object>();
        List<replyAskRespond> rasks = replyaskrespondservice.find_replyAskRespondByaskRespondIdAndstateIdAndUnequaluserId(pageIndex, askRespondId, currentUserId, "0ee26211-3ae8-48b7-973f-8488bfe837d6", "true");
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
        path = path.replace("%20", " ");
        if (null != rasks && 0 < rasks.size()) {
            for (replyAskRespond r : rasks) {
                r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                r.setReplyAskRespondContent(askrespondservice.format_askRespondDetail(path, r.getReplyAskRespondContent()));
                List<replyAskRespondComment> replyAskRespondComments = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(r.getReplyAskRespondId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if (null != replyAskRespondComments && 0 < replyAskRespondComments.size()) {
                    for (replyAskRespondComment rar : replyAskRespondComments) {
                        if (null != rar.getParentRespondCommentId() && !"".equals(rar.getParentRespondCommentId())) {
                            replyAskRespondComment parentrask = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondCommentId(rar.getParentRespondCommentId());
                            parentrask.setUser(usersservice.find_userByuseruserId(parentrask.getUserId()));
                            rar.setParentrespondcomment(parentrask);
                        }
                        rar.setUser(usersservice.find_userByuseruserId(rar.getUserId()));
                    }
                    r.setReplyaskrespondcomments(replyAskRespondComments);
                }
            }
            map.put("replyAskResponds", rasks);
        }
        map.put("currentIndex", pageIndex);
        return map;
    }

    /**
     * 修改回复问答内容
     *
     * @param replyAskRespondId
     * @param replyAskRespondContent
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("update_replyAskRespondContentByreplyAskRespondId")
    public Map<String, Object> update_replyAskRespondContentByreplyAskRespondId(String replyAskRespondId, String replyAskRespondContent, String replyBrief) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        replyAskRespond rar = replyaskrespondservice.find_replyAskRespondByreplyAskRespondId(replyAskRespondId);
        if (null != rar) {
            String path = ResourceUtils.getURL("src/main/resources/static").getPath();
            path = path.replace("%20", " ");
            File delete_file = new File(path + "/" + rar.getReplyAskRespondContent());
            if (delete_file.exists())
                delete_file.delete();
            String newfilename = "upload/replyAskRespond/replyAskRespondContent/" + Encryption.getUUID() + "." + "txt";
            File file = new File(path + "/" + newfilename);
            FileOutputStream fos = null;
            try {
                fos = new FileOutputStream(file);
                fos.write(replyAskRespondContent.getBytes());
                if (file.exists()) {
                    if (0 < replyaskrespondservice.update_replyAskRespondContentByreplyAskRespondIdAndreplyAskRespondContent(replyAskRespondId, replyBrief, newfilename))
                        map.put("result", true);
                    else
                        map.put("result", false);
                } else
                    map.put("result", false);
            } catch (Exception e) {
                e.printStackTrace();
                map.put("result", false);
            } finally {
                fos.flush();
                fos.close();
            }
        } else
            map.put("result", false);
        return map;
    }

    /**
     * 修改回复问答为删除
     *
     * @param replyAskRespondId
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_replyAskRespondByreplyAskRespondId")
    public boolean delete_replyAskRespondByreplyAskRespondId(String replyAskRespondId) throws FileNotFoundException {
        replyAskRespond rar = replyaskrespondservice.find_replyAskRespondByreplyAskRespondId(replyAskRespondId);
        if (null != rar) {
            String path = ResourceUtils.getURL("src/main/resources/static").getPath();
            path = path.replace("%20", " ");
            File delete_file = new File(path + "/" + rar.getReplyAskRespondContent());
            if (delete_file.exists())
                delete_file.delete();
            if (0 < replyaskrespondservice.update_replyAskRespond_stateIdByreplyAskRespondId(replyAskRespondId, "ac618998-ffe3-4300-a391-cd581f74078c"))
                return true;
            else
                return false;
        } else
            return false;
    }

    /**
     * 修改回复问答为最佳回答
     *
     * @param askRespondId
     * @param replyAskRespondId
     * @return
     */
    @ResponseBody
    @RequestMapping("update_replyAskRespondByreplyAskRespondId")
    public boolean update_replyAskRespondByreplyAskRespondId(String askRespondId, String replyAskRespondId) {
        if (0 < replyaskrespondservice.update_replyAskRespond_optimumAnswerByreplyAskRespondId(replyAskRespondId, "true")) {
            askrespondservice.update_stateIdByaskRespondId(askRespondId, "2130f38e-48b2-4e7e-a4cf-120aa3a149af");
            return true;
        } else
            return false;
    }

    /**
     * 添加回复问答图片
     *
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_replyAskRespondPhoto")
    public Map<Object, Object> add_replyAskRespondPhoto(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/replyAskRespond/photo").getPath().replace("%20", " "));
        return Upload.insert_Photo(uploads, request, response);
    }

    /**
     * 添加回复问答视频
     *
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_replyAskRespondVideo")
    public Map<Object, Object> add_replyAskRespondVideo(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/replyAskRespond/video").getPath().replace("%20", " "));
        return Upload.insert_Video(uploads, request, response);
    }

    /**
     * 删除回复问答图片
     *
     * @param src
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_replyAskRespondPhoto")
    public boolean delete_replyAskRespondPhoto(String src) throws FileNotFoundException {
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path + "/" + src);
    }

    /**
     * 删除回复问答视频
     *
     * @param src
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_replyAskRespondVideo")
    public boolean delete_replyAskRespondVideo(String src) throws FileNotFoundException {
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path + "/" + src);
    }

    /**
     * 根据用户编号和状态编号分页查询回复回答数量,回复
     *
     * @param userId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_replyAskRespondByuserIdAndstateIdAndPage")
    public Map<String, Object> find_replyAskRespondByuserIdAndstateIdAndPage(String userId, Integer pageIndex) {
        Integer pageSize = 10;
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("currentIndex", pageIndex);
        String[] stateIds = {"0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        List<replyAskRespond> replyAskResponds = replyaskrespondservice.find_replyAskRespondByuserIdAndstateIdAndPage(pageIndex, pageSize, userId, stateIds);
        if(null!=replyAskResponds&&0<replyAskResponds.size())
        {
            for (replyAskRespond r : replyAskResponds) {
                askRespond ask = askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(), stateIds);
                if(null!=ask)
                {
                    if (null != ask.getCityId() && !"".equals(ask.getCityId()))
                        ask.setCity(cityservice.byCityIdQuery(ask.getCityId()));
                    r.setAskrespond(ask);
                }
            }
        }
        map.put("replyAskResponds", replyAskResponds);
        Integer replyAskRespondsNum = replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(userId, stateIds);
        Integer optimumAnswerNum = replyaskrespondservice.find_replyAskRespond_optimumAnswerNum(userId, "true", stateIds);
        map.put("replyAskRespondsNum", replyAskRespondsNum);
        map.put("optimumAnswerNum", optimumAnswerNum);
        float cainalv = (float) optimumAnswerNum / replyAskRespondsNum * 100;
        map.put("cainalv", cainalv);
        Integer pages = 0;
        if (replyAskRespondsNum % pageSize > 0)
            pages = replyAskRespondsNum / pageSize + 1;
        else
            pages = replyAskRespondsNum / pageSize;
        map.put("pages", pages);
        return map;
    }

    /**
     * 通过用户编号和状态查询问答回复,提问
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_replyAskRespondByuserIdAndstateId")
    public Map<String, Object> find_replyAskRespondByuserIdAndstateId(String userId)
    {
        Map<String, Object> map=new HashMap<String, Object>();
        String[] stateIds = {"0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        List<replyAskRespond>replyAskResponds=replyaskrespondservice.find_replyAskRespondByuserIdAndstateId(userId,stateIds);
        if(null!=replyAskResponds)
        {
            for(replyAskRespond r:replyAskResponds)
            {
                askRespond ask=askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(),stateIds);
                if(null!=ask)
                {
                    ask.setReplyAskRespondNum(replyaskrespondservice.find_replyAskRespondCountByaskRespondIdAndStateId(ask.getAskRespondId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6"));
                    ask.setUser(usersservice.find_userByuseruserId(ask.getUserId()));
                    r.setAskrespond(ask);
                }
            }
        }
        map.put("replyAskResponds",replyAskResponds);
        return map;
    }
    @ResponseBody
    @RequestMapping("find_replyAskRespond_optimumAnswerByuserIdAndstateIdAndPage")
    public Map<String, Object> find_replyAskRespond_optimumAnswerByuserIdAndstateIdAndPage(String userId, Integer pageIndex) {
        Integer pageSize = 10;
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("currentIndex", pageIndex);
        String[] stateIds = {"0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        List<replyAskRespond> replyAskResponds = replyaskrespondservice.find_replyAskRespond_optimumAnswerByuserIdAndstateId(pageIndex, pageSize, userId, "true", stateIds);
        if(null!=replyAskResponds&&0<replyAskResponds.size())
        {
            for (replyAskRespond r : replyAskResponds) {
                askRespond ask = askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(), stateIds);
                if(null!=ask)
                {
                    if (null != ask.getCityId() && !"".equals(ask.getCityId()))
                        ask.setCity(cityservice.byCityIdQuery(ask.getCityId()));
                    r.setAskrespond(ask);
                }
            }
        }
        map.put("replyAskResponds", replyAskResponds);
        Integer replyAskRespondsNum = replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(userId, stateIds);
        Integer optimumAnswerNum = replyaskrespondservice.find_replyAskRespond_optimumAnswerNum(userId, "true", stateIds);
        map.put("replyAskRespondsNum", replyAskRespondsNum);
        map.put("optimumAnswerNum", optimumAnswerNum);
        float cainalv = (float) optimumAnswerNum / replyAskRespondsNum * 100;
        map.put("cainalv", cainalv);
        Integer pages = 0;
        if (optimumAnswerNum % pageSize > 0)
            pages = optimumAnswerNum / pageSize + 1;
        else
            pages = optimumAnswerNum / pageSize;
        map.put("pages", pages);
        return map;
    }

    /**
     * 通过用户编号获取收藏回复问答
     *
     * @param userId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_replyAskRespondByreplyAskRespondTopAnduserIdAndstateId")
    public Map<String, Object> find_replyAskRespondByreplyAskRespondTopAnduserIdAndstateId(String userId, Integer pageIndex) {
        Integer pageSize = 10;
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("currentIndex", pageIndex);
        String[] stateIds = {"0ee26211-3ae8-48b7-973f-8488bfe837d6", "79ce7fee-9393-4ab8-88a0-306d7b2c9d22", "2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        List<replyAskRespond> replyAskResponds = replyaskrespondservice.find_replyAskRespondByreplyAskRespondTopAnduserIdAndstateId(pageIndex, pageSize, userId, stateIds);
        if(null!=replyAskResponds&&0<replyAskResponds.size())
        {
            for (replyAskRespond r : replyAskResponds) {
                askRespond ask = askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(), stateIds);
                if(null!=ask)
                {
                    if (null != ask.getCityId() && !"".equals(ask.getCityId()))
                        ask.setCity(cityservice.byCityIdQuery(ask.getCityId()));
                    r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                    r.setAskrespond(ask);
                }
            }
        }
        map.put("replyAskResponds", replyAskResponds);
        Integer replyAskRespondsNum = replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(userId, stateIds);
        Integer optimumAnswerNum = replyaskrespondservice.find_replyAskRespond_optimumAnswerNum(userId, "true", stateIds);
        Integer replyAskRespondTopNums = replyaskrespondtopservice.find_replyAskRespondTop_CountByuserIdAndstateId(userId, stateIds);
        map.put("replyAskRespondsNum", replyAskRespondsNum);
        map.put("optimumAnswerNum", optimumAnswerNum);
        map.put("replyAskRespondTopNums", replyAskRespondTopNums);
        float cainalv = (float) optimumAnswerNum / replyAskRespondsNum * 100;
        map.put("cainalv", cainalv);
        Integer pages = 0;
        if (replyAskRespondTopNums % pageSize > 0)
            pages = replyAskRespondTopNums / pageSize + 1;
        else
            pages = replyAskRespondTopNums / pageSize;
        map.put("pages", pages);
        return map;
    }

    /**
     * 通过用户编号和状态获取回复问答,当做问答消息
     * @return
     */
    @ResponseBody
    @RequestMapping("find_replyAskRespond_Message_askRespondByuserIdAndstateId")
    public Map<String, Object> find_replyAskRespond_Message_askRespondByuserIdAndstateId(HttpSession session)
    {
        String [] stateIds={"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        Map<String, Object> map=new HashMap<String, Object>();
        users user= (users) session.getAttribute("user");
        map.put("currentUser",user);
        List<replyAskRespond> replyAskResponds=replyaskrespondservice.find_replyAskRespond_Message_askRespondByuserIdAndstateId(user.getUserId(),stateIds);
        if(null!=replyAskResponds&&0<replyAskResponds.size())
        {
            for(replyAskRespond r:replyAskResponds)
            {
                r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                r.setAskrespond(askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(),stateIds));
            }
        }
        map.put("replyAskResponds",replyAskResponds);
        return map;
    }

    /**
     * 通过用户编号和状态获取回复问答,当做问答消息
     * @return
     */
    @ResponseBody
    @RequestMapping("find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId")
    public Map<String, Object> find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId(HttpSession session)
    {
        String [] stateIds={"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        Map<String, Object> map=new HashMap<String, Object>();
        users user= (users) session.getAttribute("user");
        map.put("currentUser",user);
        List<replyAskRespond> replyAskResponds=replyaskrespondservice.find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId(user.getUserId(),stateIds);
        if(null!=replyAskResponds&&0<replyAskResponds.size())
        {
            for(replyAskRespond r:replyAskResponds)
            {
                r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                r.setAskrespond(askrespondservice.find_askRespondByaskRespondId(r.getAskRespondId(),stateIds));
            }
        }
        map.put("replyAskResponds",replyAskResponds);
        return map;
    }
}
