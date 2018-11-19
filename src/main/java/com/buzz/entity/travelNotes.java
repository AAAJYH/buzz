package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class travelNotes
{
    private String travelNotesId;
    private String travelNotesheadline;
    private String travelNotesheadPhoto;
    private String backgroundMusicName;
    private String backgroundMusic;
    private String travelNotesContent;
    private List<travelNotesContent> travelNotesContents;
    private String userId;
    private users user;
    private Timestamp releaseTime;
    private long browsingHistory;
    private long collectionNumber;//收藏数量,数据库中不存在,只存在于实体类中
    private String cityId;
    private city city;
    private String stateId;
    private String oldstateId;
    private String travelCollectionId;//收藏游记编号,不存在于数据库
}
