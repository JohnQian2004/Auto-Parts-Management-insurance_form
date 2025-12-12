package com.xoftex.parthub.models;

import java.util.List;

public class GroupBy {

    public long count;
    public int status;
    public String name;
    public List<Expense> expenses;

    public GroupBy() {

    }

    public long getCount() {
        return count;
    }

    public int getStatus() {
        return status;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "GroupBy [count=" + count + ", status=" + status + "]";
    }

    public GroupBy(long count, int status) {
        this.count = count;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
}
