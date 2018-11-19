package com.buzz.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class travelCollection
{
    private String travelCollectionId;
    private String userId;
    private users user;
    private String travelNotesId;
    private String collectionTime;
}
