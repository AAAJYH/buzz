package com.buzz.controller;

import com.alibaba.fastjson.JSON;
import com.buzz.entity.*;
import com.buzz.service.*;
import com.buzz.utils.Encryption;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.crypto.dsig.spec.ExcC14NParameterSpec;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("travelNotesController")
public class travelNotesController {
    @Resource
    private travelNotesService travelnotesservice;
    @Resource
    private usersService usersservice;
    @Resource
    private cityService cityservice;
    @Resource
    private travelCollectionService travelcollectionservice;
    @Resource
    private travelNotesReplyService travelnotesreplyservice;
    /**
     * 根据用户编号和状态查询游记
     *
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotes_ByuserId")
    public List<travelNotes> find_travelNotes_ByuserId(HttpSession session) {
        users user = (users) session.getAttribute("user");
        return travelnotesservice.find_travelNotes_ByuserId(user.getUserId(), "aa093f4b-1c4c-4f4f-8626-87d51c50d58b");
    }
    //根据游记编号显示游记信息
    @RequestMapping("find_travelNotes_travelNotesId")
    public String find_travelNotes_travelNotesId(String travelNotesId, Model model) throws IOException {
        if(null!=travelNotesId&&!"".equals(travelNotesId))
        {
            travelNotes travelnotes = travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
            String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
            path = path.replace("%20", " ");
            travelnotes = travelnotesservice.format_travelNotesContents(travelnotes, path);
            if(null==travelnotes)
                return "redirect:/404.html";
            else
            {
                model.addAttribute("travelNotes", travelnotes);
                return "front_desk/travelNotes/createtravelNotes";
            }
        }
        else
            return "redirect:/404.html";
    }

    /**
     * 检验该用户草稿游记是否超出十个
     *
     * @param session
     * @return true 未超出,false超出
     */
    @ResponseBody
    @RequestMapping("check_travelNotesNumber")
    public boolean check_travelNotesNumber(HttpSession session) {
        users user = (users) session.getAttribute("user");
        Integer result = travelnotesservice.find_travelNotes_NumberByuserId(user.getUserId(), "aa093f4b-1c4c-4f4f-8626-87d51c50d58b");
        if (null == result || 10 > result)
            return true;
        else
            return false;
    }

    /**
     * 剪切图片
     *
     * @param imgUrl        图片路径
     * @param travelNotesId 游记编号
     * @param imgInitW
     * @param imgInitH
     * @param imgW
     * @param imgH
     * @param imgY1
     * @param imgX1
     * @param cropH
     * @param cropW
     * @param rotation
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("uploadPhotos")
    public Map<String, Object> uploadPhotos(String imgUrl, String travelNotesId, int imgInitW, int imgInitH, double imgW, double imgH, int imgY1, int imgX1, int cropH, int cropW, int rotation) throws IOException {
        Map<String, Object> map = new HashMap();
        if (imgInitH < 900 || imgInitW < 1600) {
            map.put("status", "error");
            map.put("message", "抱歉,请重新选择图片,图片宽度不能小于1600px,高度不行小于900px");
            return map;
        } else {
            //获取图片信息
            String img_Data = imgUrl.substring(imgUrl.indexOf(",") + 1);
            String img_type = imgUrl.substring(imgUrl.indexOf("/") + 1, imgUrl.indexOf(";"));
            BASE64Decoder decoder = new BASE64Decoder();
            //转换为byte数组
            byte[] imgData = decoder.decodeBuffer(img_Data);
            String path = ResourceUtils.getURL("src/main/resources/static/images/travelNotesheadPhotos").getPath();
            path = path.replace("%20", " ");
            //原图名称
            String oldfilename = path + "/" + Encryption.getUUID() + "." + img_type;
            //原图文件
            File oldfile = new File(oldfilename);
            FileOutputStream out = new FileOutputStream(oldfile);
            out.write(imgData);
            out.flush();
            out.close();
            try {
                BufferedImage bi = Encryption.file2img(oldfilename);  //读取图片
                int w = 1920 - cropW;
                if (imgY1 > imgInitH - 650)
                    imgY1 = imgInitH - 650;
                BufferedImage bii = Encryption.img_tailor(bi, 0, imgY1, imgInitW, 650);
                String newfilename = Encryption.getUUID() + "." + img_type;
                String newfilepath = path + "/" + newfilename;
                Encryption.img2file(bii, "jpg", newfilepath);  //生成图片
                travelNotes travelnotes = travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
                if (null != travelnotes)//判断之前是否设置游记头图,如果设置删除
                {
                    if (null != travelnotes.getTravelNotesheadPhoto() && !("").equals(travelnotes.getTravelNotesheadPhoto())) {

                        File delete_file = new File(path + "/" + travelnotes.getTravelNotesheadPhoto().substring(travelnotes.getTravelNotesheadPhoto().lastIndexOf("/")));
                        if (delete_file.exists())
                            delete_file.delete();
                    }
                }
                File file = new File(newfilepath);
                if (file.exists()) {
                    if (0 < travelnotesservice.update_travelNotesheadPhoto_BytravelNotesId(travelNotesId, "images/travelNotesheadPhotos/" + newfilename)) {
                        map.put("status", "success");
                        map.put("url", "images/travelNotesheadPhotos/" + newfilename);
                    } else {
                        map.put("status", "error");
                        map.put("message", "设置图片错误");
                    }
                } else {
                    map.put("status", "error");
                    map.put("message", "设置图片错误");
                }
                return map;
            } catch (Exception e) {
                e.printStackTrace();
                map.put("status", "error");
                map.put("message", "设置图片错误");
                return map;
            } finally {
                if (oldfile.exists())//如果存在删除文件旧图片
                {
                    oldfile.delete();
                }
            }
        }
    }

    /**
     * 获取剪切之后的图片
     *
     * @param path     路径
     * @param response
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("gettravelNotesheadPhoto")
    public void gettravelNotesheadPhoto(String path, HttpServletResponse response) throws IOException {
        FileInputStream fis = null;
        OutputStream os = null;
        try {
            fis = new FileInputStream(path);
            os = response.getOutputStream();
            int count = 0;
            byte[] buffer = new byte[1024 * 8];
            while ((count = fis.read(buffer)) != -1) {
                os.write(buffer, 0, count);
                os.flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            os.close();
            fis.close();
        }
    }

    /**
     * 添加游记图片
     *
     * @param travelNotesphoto 游记图片
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("insert_travelNotesphoto")
    public Map<String, Object> insert_travelNotesphoto(@RequestParam("travelNotesphoto") MultipartFile travelNotesphoto) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        String oldfilename = travelNotesphoto.getOriginalFilename();
        String filetype = oldfilename.substring(oldfilename.lastIndexOf("."));
        String newfilename = Encryption.getUUID() + filetype;
        FileOutputStream fos = null;
        try {
            String path = ResourceUtils.getURL("src/main/resources/static/images/travelNotesphoto").getPath();
            path = path.replace("%20", " ");
            byte[] bytes = travelNotesphoto.getBytes();
            fos = new FileOutputStream(path + "/" + newfilename);
            fos.write(bytes);
            fos.flush();
            File file = new File(path + "/" + newfilename);
            if (file.exists())//判断文件是否存在
            {
                map.put("result", true);
                map.put("url", "images/travelNotesphoto/" + newfilename);
            } else
                map.put("result", false);
        } catch (IOException e) {
            map.put("result", false);
            e.printStackTrace();
        } finally {
            if (null != fos) {
                fos.close();
            }
        }
        return map;
    }

    /**
     * 删除游记图片
     *
     * @param url 游记图片路径
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_travelNotesphoto")
    public Map<String, Object> delete_travelNotesphoto(String url) throws FileNotFoundException {
        Map<String, Object> map = new HashMap<String, Object>();
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        try {
            File file = new File(path + "/" + url);
            if (file.exists()) {
                file.delete();//删除图片
            }
            map.put("result", true);
        } catch (Exception e) {
            map.put("result", false);
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 添加背景音乐
     *
     * @param backgroundMusic
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("insert_backgroundMusic")
    public Map<String, Object> insert_backgroundMusic(@RequestParam("backgroundMusic") MultipartFile backgroundMusic, String travelNotesId) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        String oldname = backgroundMusic.getOriginalFilename();
        String filetype = oldname.substring(oldname.lastIndexOf("."));
        String name = oldname.substring(0, oldname.lastIndexOf("."));
        oldname = oldname.substring(0, oldname.lastIndexOf("."));
        String newname = Encryption.getUUID() + filetype;
        FileOutputStream fos = null;
        try {
            String path = ResourceUtils.getURL("src/main/resources/static/music/travelNotes/backgroundMusic").getPath();
            path = path.replace("%20", " ");
            travelNotes travelnotes = travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
            if (null != travelnotes)//如果之前有背景音乐删除
            {
                if (null != travelnotes.getBackgroundMusic() && !"".equals(travelnotes.getBackgroundMusic())) {
                    File delete_file = new File(path + "/" + travelnotes.getBackgroundMusic().substring(travelnotes.getBackgroundMusic().lastIndexOf("/")));
                    if (delete_file.exists())
                        delete_file.delete();
                }
            }
            byte[] bytes = backgroundMusic.getBytes();
            fos = new FileOutputStream(path + "/" + newname);
            fos.write(bytes);
            fos.flush();
            File file = new File(path + "/" + newname);
            if (file.exists())//如果上传文件存在则修改
            {
                if (0 < travelnotesservice.update_backgroundMusicAndName_BytravelNotesId(travelNotesId, name, "music/travelNotes/backgroundMusic/" + newname)) {
                    map.put("result", true);
                    map.put("url", "music/travelNotes/backgroundMusic/" + newname);
                    map.put("musicname", name);
                } else
                    map.put("result", false);
            }
        } catch (Exception e) {
            map.put("result", false);
            e.printStackTrace();
        } finally {
            if (null != fos) {
                fos.close();
            }
        }
        return map;
    }

    /**
     * 根据游记编号修改背景音乐名称
     *
     * @param travelNotesId       游记编号
     * @param backgroundMusicName 背景音乐
     * @return
     */
    @ResponseBody
    @RequestMapping("update_backgroundMusicName_BytravelNotesId")
    public boolean update_backgroundMusicName_BytravelNotesId(String travelNotesId, String backgroundMusicName) {
        if (0 < travelnotesservice.update_backgroundMusicName_BytravelNotesId(travelNotesId, backgroundMusicName))
            return true;
        else
            return false;
    }

    @ResponseBody
    @RequestMapping("delete_backgroundMusic_BytravelNotesId")
    public boolean delete_backgroundMusic_BytravelNotesId(String travelNotesId, String backgroundMusic) {
        try {
            String path = ResourceUtils.getURL("src/main/resources/static/music/travelNotes/backgroundMusic").getPath();
            path = path.replace("%20", " ");
            backgroundMusic = backgroundMusic.substring(backgroundMusic.lastIndexOf("/"));
            File delete_file = new File(path + "/" + backgroundMusic);
            if (0 < travelnotesservice.update_backgroundMusicAndName_BytravelNotesId(travelNotesId, "", "")) {
                if (delete_file.exists()) {
                    delete_file.delete();
                }
                return true;
            } else
                return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 添加为游记为草稿
     *
     * @param travelNotesId       游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent  游记内容
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_travelNotes_draft")
    public boolean insert_travelNotes_draft(String travelNotesId, String travelNotesheadline, String travelNotesContent) throws IOException {
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        travelNotes travelnotes = travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
        travelnotesservice.delete_travelNotesContentFile(travelnotes, path);//删除之前的游记内容文件
        String newfilename = "upload/travelNotes/travelNotesContent/" + Encryption.getUUID() + "." + "txt";
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(travelNotesContent.getBytes());
            if (file.exists()) {
                if (0 < travelnotesservice.update_travelNotesContentAndheadline_BytravelNotesId(travelNotesId, travelNotesheadline, newfilename))
                    return true;
                else
                    return false;
            } else
                return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (null != fos) {
                fos.flush();
                fos.close();
            }
        }
    }

    /**
     * 根据游记编号预览游记
     *
     * @param travelNotesId
     * @return
     */
    @ResponseBody
    @RequestMapping("preview_travelNotes")
    public travelNotes preview_travelNotes(String travelNotesId) throws IOException {
        travelNotes travelnotes = travelnotesservice.find_travelNotesBytravelNotesIdAndstateId(travelNotesId,"aa093f4b-1c4c-4f4f-8626-87d51c50d58b","30d3e6ed-f7b4-43cd-95e5-5ac428f15245","b45b8bd7-4ce2-407a-9622-3040573f6710");
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
        path = path.replace("%20", " ");
        travelnotes = travelnotesservice.format_travelNotesContents(travelnotes, path);
        if(null!=travelnotes)
            travelnotes.setUser(usersservice.find_userByuseruserId(travelnotes.getUserId()));
        return travelnotes;
    }

    /**
     * 提交游记
     *
     * @param travelNotesId       游记编号
     * @param travelNotesheadline 游记标题
     * @param travelNotesContent  游记内容
     * @param session
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("publish_travelNotes")
    public Map<String, Object> publish_travelNotes(String travelNotesId, String travelNotesheadline, String travelNotesContent, HttpSession session) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        travelNotes travelnotes = travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
        travelnotesservice.delete_travelNotesContentFile(travelnotes, path);//删除之前的游记内容文件
        String newfilename = "upload/travelNotes/travelNotesContent/" + Encryption.getUUID() + "." + "txt";
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(travelNotesContent.getBytes());
            if (file.exists()) {
                //修改游记为等待审核
                if (0 < travelnotesservice.update_travelNotesContentAndheadlineAndstate_BytravelNotesId(travelNotesId, travelNotesheadline, newfilename, "30d3e6ed-f7b4-43cd-95e5-5ac428f15245")) {
                    int imageNum = 0;
                    int fontNum = 0;
                    int travelNotesNum = 0;
                    users user = (users) session.getAttribute("user");
                    if (null != user) {
                        //查询等待审核和审核通过的游记
                        List<travelNotes> list = travelnotesservice.find_travelNotes_ByuserId(user.getUserId(), "b45b8bd7-4ce2-407a-9622-3040573f6710", "30d3e6ed-f7b4-43cd-95e5-5ac428f15245");
                        if (null != list && 0 < list.size()) {
                            travelNotesNum = list.size();
                            for (travelNotes t : list) {
                                t = travelnotesservice.format_travelNotesContents(t, path);
                                if(null!=t&&null!=t.getTravelNotesContents()&&0<t.getTravelNotesContents().size())
                                {
                                    for (travelNotesContent travelnotescontent : t.getTravelNotesContents()) {
                                        if (travelnotescontent.getType().equals("img")) {
                                            imageNum += 1;
                                        } else if (travelnotescontent.getType().equals("h2") || travelnotescontent.getType().equals("textarea")) {
                                            if (null != travelnotescontent.getValue()) {
                                                fontNum += travelnotescontent.getValue().length();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    map.put("Beijing", "77420ca9-eb80-4257-83dc-843cd21a4bd0");//返回北京城市编号
                    map.put("travelNotesheadPhoto", travelnotes.getTravelNotesheadPhoto());
                    map.put("imageNum", imageNum);
                    map.put("fontNum", fontNum);
                    map.put("travelNotesNum", travelNotesNum);
                    map.put("result", true);
                    return map;
                } else {
                    map.put("result", false);
                    return map;
                }
            } else {
                map.put("result", false);
                return map;
            }
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", false);
            return map;
        } finally {
            if (null != fos) {
                fos.flush();
                fos.close();
            }
        }
    }

    /**
     * 根据游记编号修改游记所属城市
     *
     * @param travelNotesId 游记编号
     * @param cityId        城市编号
     * @return
     */
    @ResponseBody
    @RequestMapping("update_travelNotes_cityId")
    public boolean update_travelNotes_cityId(String travelNotesId, String cityId) {
        if (0 < travelnotesservice.update_travelNotes_cityId_BytravelNotesId(travelNotesId, cityId))
            return true;
        else
            return false;
    }

    /**
     * 根据游记编号修改游记状态为删除
     * @param travelNotesId
     * @return
     */
    @ResponseBody
    @RequestMapping("update_travelNotes_stateId_BytravelNotesId")
    public boolean update_travelNotes_stateId_BytravelNotesId(String travelNotesId)
    {
        if(0<travelnotesservice.update_travelNotes_stateId_BytravelNotesId(travelNotesId,"ac618998-ffe3-4300-a391-cd581f74078c"))
            return true;
        else
            return false;
    }

    /**
     * 创建新的游记
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("insert_travelNotes")
    public Map<String,Object> insert_travelNotes(HttpSession session)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        travelNotes t=new travelNotes();
        t.setTravelNotesId(Encryption.getUUID());
        t.setUserId(user.getUserId());
        t.setBrowsingHistory(0);
        t.setStateId("aa093f4b-1c4c-4f4f-8626-87d51c50d58b");
        if(0<travelnotesservice.insert_travelNotes(t))
        {
            map.put("result",true);
            map.put("travelNotesId",t.getTravelNotesId());
        }
        else
            map.put("result",false);
        return map;
    }
    @ResponseBody
    @RequestMapping("show_travelNotes")
    public Map<String,Object> show_travelNotes(String travelNotesId) throws IOException
    {
        Map<String,Object> map=new HashMap<String,Object>();
        travelNotes travelnotes = travelnotesservice.find_travelNotesBytravelNotesIdAndstateId(travelNotesId,"30d3e6ed-f7b4-43cd-95e5-5ac428f15245","b45b8bd7-4ce2-407a-9622-3040573f6710","ac618998-ffe3-4300-a391-cd581f74078c");
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
        path = path.replace("%20", " ");
        travelnotes = travelnotesservice.format_travelNotesContents(travelnotes, path);
        if(null!=travelnotes)
        {
            travelnotes.setUser(usersservice.find_userByuseruserId(travelnotes.getUserId()));
            if(null!=travelnotes&&null!=travelnotes.getCityId()&&!"".equals(travelnotes.getCityId()))
                travelnotes.setCity(cityservice.byCityIdQuery(travelnotes.getCityId()));
            map.put("travelNotes",travelnotes);
        }
        return map;
    }

    /**
     * 根据游记编号修改游记状态为删除,并将当前游记状态保存在oldstateId中
     * @param travelNotesId 游记编号
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_travelNotesBytravelNotesId")
    public boolean delete_travelNotesBytravelNotesId(String travelNotesId)
    {
        if(0<travelnotesservice.update_travelNotes_stateId_oldstateId_BytravelNotesId(travelNotesId,"ac618998-ffe3-4300-a391-cd581f74078c"))
            return true;
        else
            return false;
    }

    /**
     * 根据游记编号查询以前的状态,并进行修改
     * @param travelNotesId 游记编号
     * @return
     */
    @ResponseBody
    @RequestMapping("restore_travelNotesBytravelNotesId")
    public boolean restore_travelNotesBytravelNotesId(String travelNotesId)
    {
        travelNotes travelnotes=travelnotesservice.find_travelNotes_travelNotesId(travelNotesId);
        if(0<travelnotesservice.update_travelNotes_stateId_BytravelNotesId(travelNotesId,travelnotes.getOldstateId()))
            return true;
        else
            return false;
    }

    /**
     * 添加游记访问数量
     * @param travelNotesId
     * @return
     */
    @ResponseBody
    @RequestMapping("add_travelNotes_browsingHistoryBytravelNotesId")
    public boolean add_travelNotes_browsingHistoryBytravelNotesId(String travelNotesId)
    {
        if(0<travelnotesservice.add_travelNotes_browsingHistoryBytravelNotesId(travelNotesId))
            return true;
        else
            return false;
    }

    /**
     * 根据用户编号查询游记
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesByuserId")
    public List<travelNotes> find_travelNotesByuserId(String userId)
    {
        List<travelNotes> list=travelnotesservice.find_travelNotes_ByuserId(userId,"b45b8bd7-4ce2-407a-9622-3040573f6710","30d3e6ed-f7b4-43cd-95e5-5ac428f15245");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
                if(null!=t&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
            }
        }
        return list;
    }

    /**
     * 查过用户编号查询所属游记,赞游记用户,游记评论
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("load_travelNotes_travelNotesReplyByuserId")
    public Map<String,Object> load_travelNotesByuserId(String userId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<travelNotes> travelNotes=travelnotesservice.find_travelNotes_ByuserId(userId,"b45b8bd7-4ce2-407a-9622-3040573f6710","30d3e6ed-f7b4-43cd-95e5-5ac428f15245");
        if(null!=travelNotes&&0<travelNotes.size())
        {
            List<travelNotesReply>travelNotesReplys=new ArrayList<travelNotesReply>();
            for(travelNotes t:travelNotes)
            {
                if(null!=t&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                List travelNotesReplylist=travelnotesreplyservice.find_travelNotesReplyBytravelNotesIdAndstateIdNoPage(t.getTravelNotesId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if(null!=travelNotesReplylist&&0<travelNotesReplylist.size())
                    travelNotesReplys.addAll(travelNotesReplylist);
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
            map.put("travelNotes",travelNotes);
            if(null!=travelNotesReplys&&0<travelNotesReplys.size())
            {
                for(travelNotesReply tnr:travelNotesReplys)
                    tnr.setUser(usersservice.find_userByuseruserId(tnr.getUserId()));
            }
            map.put("travelNotesReplys",travelNotesReplys);
            map.put("travelCollectionUsers",usersservice.find_user_travelCollectionuserByuserId(userId));
        }
        return map;
    }
    /**
     * 查过用户编号查询删除游记,赞游记用户,游记评论
     * @return
     */
    @ResponseBody
    @RequestMapping("load_delete_travelNotes_travelNotesReplyByuserId")
    public Map<String,Object> load_delete_travelNotes_travelNotesReplyByuserId(HttpSession session)
    {
        users user= (users) session.getAttribute("user");
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("user",user);
        List<travelNotes> travelNotes=travelnotesservice.find_travelNotes_ByuserId(user.getUserId(),"ac618998-ffe3-4300-a391-cd581f74078c");
        if(null!=travelNotes&&0<travelNotes.size())
        {
            List<travelNotesReply>travelNotesReplys=new ArrayList<travelNotesReply>();
            for(travelNotes t:travelNotes)
            {
                if(null!=t&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                List travelNotesReplylist=travelnotesreplyservice.find_travelNotesReplyBytravelNotesIdAndstateIdNoPage(t.getTravelNotesId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if(null!=travelNotesReplylist&&0<travelNotesReplylist.size())
                    travelNotesReplys.addAll(travelNotesReplylist);
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
            map.put("travelNotes",travelNotes);
            if(null!=travelNotesReplys&&0<travelNotesReplys.size())
            {
                for(travelNotesReply tnr:travelNotesReplys)
                    tnr.setUser(usersservice.find_userByuseruserId(tnr.getUserId()));
            }
            map.put("travelNotesReplys",travelNotesReplys);
        }
        map.put("travelCollectionUsers",usersservice.find_user_travelCollectionuserByuserId(user.getUserId()));
        return map;
    }
    /**
     * 根据用户编号获取该用户收藏的游记
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesBytravelCollectionAnduserIdAndstateId")
    public Map<String,Object> find_travelNotesBytravelCollectionAnduserIdAndstateId(String userId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<travelNotes> travelNotes=travelnotesservice.find_travelNotesBytravelCollectionAnduserIdAndstateId(userId,"b45b8bd7-4ce2-407a-9622-3040573f6710","30d3e6ed-f7b4-43cd-95e5-5ac428f15245");
        if(null!=travelNotes&&0<travelNotes.size())
        {
            List<travelNotesReply>travelNotesReplys=new ArrayList<travelNotesReply>();
            for(travelNotes t:travelNotes)
            {
                if(null!=t&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                List travelNotesReplylist=travelnotesreplyservice.find_travelNotesReplyBytravelNotesIdAndstateIdNoPage(t.getTravelNotesId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if(null!=travelNotesReplylist&&0<travelNotesReplylist.size())
                    travelNotesReplys.addAll(travelNotesReplylist);
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
            map.put("travelNotes",travelNotes);
            if(null!=travelNotesReplys&&0<travelNotesReplys.size())
            {
                for(travelNotesReply tnr:travelNotesReplys)
                    tnr.setUser(usersservice.find_userByuseruserId(tnr.getUserId()));
            }
            map.put("travelNotesReplys",travelNotesReplys);
            map.put("travelCollectionUsers",usersservice.find_user_travelCollectionuserByuserId(userId));
        }
        return map;
    }
    @ResponseBody
    @RequestMapping("load_travelNotesBypageIndexAndcityId")
    public Map<String,Object> load_travelNotesBypageIndexAndcityId(Integer pageIndex,String cityId) throws IOException {
        if(null==cityId||cityId.equals(""))
            cityId=null;
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("currentPageIndex",pageIndex);
        Integer totalCount=travelnotesservice.find_travelNotesCountBycityIdAndstaticId(cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        map.put("totalCount",totalCount);
        if(totalCount%10>0)
            map.put("totalPageCount",totalCount/10+1);
        else
            map.put("totalPageCount",totalCount/10);
        List <travelNotes>list=travelnotesservice.find_travelNotesBycityIdAndstaticId(pageIndex,cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                    path = path.replace("%20", " ");
                    travelnotesservice.format_travelNotesContents(t,path);
                }
                if(null!=t.getCityId()&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                if(null!=t.getUserId()&&!"".equals(t.getUserId()))
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
        }
        map.put("travelNotes",list);
        return map;
    }
    /**
     * 根据发布时间倒序获取游记
     * @param pageIndex
     * @param cityId
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("load_travelNotesBypageIndexAndcityIdAndreleaseTimedesc")
    public Map<String,Object> load_travelNotesBypageIndexAndcityIdAndreleaseTimedesc(Integer pageIndex,String cityId) throws IOException
    {
        if(null==cityId||cityId.equals(""))
            cityId=null;
        Map<String,Object> map=new HashMap<String,Object>();
        Integer totalCount=travelnotesservice.find_travelNotesCountBycityIdAndstaticId(cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        map.put("totalCount",totalCount);
        map.put("currentPageIndex",pageIndex);
        if(totalCount%10>0)
            map.put("totalPageCount",totalCount/10+1);
        else
            map.put("totalPageCount",totalCount/10);
        List <travelNotes>list=travelnotesservice.find_travelNotesBycityIdAndstaticIdAndreleaseTimedesc(pageIndex,cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                if(null!=t.getUserId()&&!"".equals(t.getUserId()))
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                if(null!=t.getCityId()&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                    path = path.replace("%20", " ");
                    travelnotesservice.format_travelNotesContents(t,path);
                }
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
        }
        map.put("travelNotes",list);
        return map;
    }

    /**
     * 获取热门游记
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("find_travelNotesByHot")
    public travelNotes find_travelNotesByHot() throws IOException
    {
        travelNotes t=travelnotesservice.find_travelNotesByHot();
        if(null!=t)
        {
            if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
            {
                String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                path = path.replace("%20", " ");
                travelnotesservice.format_travelNotesContents(t,path);
            }
        }
        return t;
    }

    /**
     * 根据用户获取游记,游记回复,并将游记回复时间,存入游记的发布时间,游记回复内容存入游记内容,游记回复用户存入游记用户
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotes_travelNotesReplyByuserIdAndStateId")
    public Map<String,Object> find_travelNotes_travelNotesReplyByuserIdAndStateId(HttpSession session)
    {
        String [] stateIds={"b45b8bd7-4ce2-407a-9622-3040573f6710","30d3e6ed-f7b4-43cd-95e5-5ac428f15245","0ee26211-3ae8-48b7-973f-8488bfe837d6"};
        Map<String,Object> map=new HashMap<String,Object>();
        users user= (users) session.getAttribute("user");
        map.put("currentUser",user);
        List<travelNotes> travelNotes=travelnotesservice.find_travelNotes_travelNotesReplyByuserIdAndStateId(user.getUserId(),stateIds);
        if(null!=travelNotes&&0<travelNotes.size())
        {
            for(travelNotes t:travelNotes)
                t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
        }
        map.put("travelNotes",travelNotes);
        return map;
    }

    /**
     * 根据城市编号和页数查询游记
     * @param cityId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesBycityIdAndpageIndex")
    public Map<String,Object> find_travelNotesBycityIdAndpageIndex(String cityId,Integer pageIndex) throws IOException
    {
        Map<String,Object> map=new HashMap<String,Object>();
        city city=new city();
        if(null!=cityId&&!"".equals(cityId))
            city=cityservice.byCityIdQuery(cityId);
        else
            city.setCityName("全部");
        map.put("city",city);
        map.put("currentPageIndex",pageIndex);
        Integer totalCount=travelnotesservice.find_travelNotesCountBycityIdAndstaticId(cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        map.put("totalCount",totalCount);
        if(totalCount%10>0)
            map.put("totalPageCount",totalCount/10+1);
        else
            map.put("totalPageCount",totalCount/10);
        List <travelNotes>list=travelnotesservice.find_travelNotesBycityIdAndstaticId(pageIndex,cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                    path = path.replace("%20", " ");
                    travelnotesservice.format_travelNotesContents(t,path);
                }
                if(null!=t.getCityId()&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                if(null!=t.getUserId()&&!"".equals(t.getUserId()))
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
        }
        map.put("travelNotes",list);
        return map;
    }

    /**
     * 根据城市编号和页数查询最新的游记
     * @param cityId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesBycityIdAndpageIndexAndreleaseTimedesc")
    public Map<String,Object> find_travelNotesBycityIdAndpageIndexAndreleaseTimedesc(String cityId,Integer pageIndex) throws IOException
    {
        Map<String,Object> map=new HashMap<String,Object>();
        city city=new city();
        if(null!=cityId&&!"".equals(cityId))
            cityservice.byCityIdQuery(cityId);
        else
            city.setCityName("全部");
        map.put("city",city);
        map.put("currentPageIndex",pageIndex);
        Integer totalCount=travelnotesservice.find_travelNotesCountBycityIdAndstaticId(cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        map.put("totalCount",totalCount);
        if(totalCount%10>0)
            map.put("totalPageCount",totalCount/10+1);
        else
            map.put("totalPageCount",totalCount/10);
        List <travelNotes>list=travelnotesservice.find_travelNotesBycityIdAndstaticIdAndreleaseTimedesc(pageIndex,cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                    path = path.replace("%20", " ");
                    travelnotesservice.format_travelNotesContents(t,path);
                }
                if(null!=t.getCityId()&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                if(null!=t.getUserId()&&!"".equals(t.getUserId()))
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
        }
        map.put("travelNotes",list);
        return map;
    }
    /**
     * 根据用户编号和城市编号查询游记
     * @param cityId
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_travelNotesByuserIdAndcityId")
    public List<travelNotes> find_travelNotesByuserIdAndcityId(String cityId,String userId) throws IOException {
        List<travelNotes> list=travelnotesservice.find_travelNotesByuserIdAndcityIdAndstateId(userId,cityId,"b45b8bd7-4ce2-407a-9622-3040573f6710");
        if(null!=list&&0<list.size())
        {
            for(travelNotes t:list)
            {
                if(null!=t.getTravelNotesContent()&&!"".equals(t.getTravelNotesContent()))
                {
                    String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
                    path = path.replace("%20", " ");
                    travelnotesservice.format_travelNotesContents(t,path);
                }
                if(null!=t.getCityId()&&!"".equals(t.getCityId()))
                    t.setCity(cityservice.byCityIdQuery(t.getCityId()));
                if(null!=t.getUserId()&&!"".equals(t.getUserId()))
                    t.setUser(usersservice.find_userByuseruserId(t.getUserId()));
                t.setCollectionNumber(travelcollectionservice.find_travelCollectionCountBytravelNotesId(t.getTravelNotesId()));
            }
        }
        return list;
    }
}
