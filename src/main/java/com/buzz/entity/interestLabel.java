package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class interestLabel
{
    private String interestLabelId;
    private String interestLabelName;
    private Timestamp releaseTime;
    private String stateId;
}
