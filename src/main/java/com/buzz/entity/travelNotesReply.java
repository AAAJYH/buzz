package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class travelNotesReply
{
    private String travelNotesReplyId;
    private String travelNotesId;
    private String userId;
    private users user;
    private String travelNotesReplyIdReply;
    private travelNotesReply travelNotesReplyReply;
    private String replyContent;
    private String stateId;
    private Timestamp replyTime;
}
