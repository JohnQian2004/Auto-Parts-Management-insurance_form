package com.xoftex.parthub.models;

public class SequenceCarrier {

    public long id;
    public int index;
    public int pageNumber;
    public int pageSize;

    public SequenceCarrier() {

    }

    public long getId() {
        return id;
    }

    public int getIndex() {
        return index;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
 
    
}
