package com.xoftex.parthub.payload.response;

public class UserSatisticsResponse {
	private int totalAutoparts = 0;
	private int totalAutopartsPublished = 0;
	private int totalAutopartsUnpublished = 0;
	private int totalAutopartsArchieved = 0;
    private int totalSavedItems =0;
	private int totalViewCount = 0;
	


	public int getTotalAutoparts() {
		return totalAutoparts;
	}
	public int getTotalAutopartsPublished() {
		return totalAutopartsPublished;
	}
	public int getTotalAutopartsUnpublished() {
		return totalAutopartsUnpublished;
	}
	public int getTotalAutopartsArchieved() {
		return totalAutopartsArchieved;
	}
	public void setTotalAutoparts(int totalAutoparts) {
		this.totalAutoparts = totalAutoparts;
	}
	public void setTotalAutopartsPublished(int totalAutopartsPublished) {
		this.totalAutopartsPublished = totalAutopartsPublished;
	}
	public void setTotalAutopartsUnpublished(int totalAutopartsUnpublished) {
		this.totalAutopartsUnpublished = totalAutopartsUnpublished;
	}
	public void setTotalAutopartsArchieved(int totalAutopartsArchieved) {
		this.totalAutopartsArchieved = totalAutopartsArchieved;
	}
	public int getTotalSavedItems() {
		return totalSavedItems;
	}
	public void setTotalSavedItems(int totalSavedItems) {
		this.totalSavedItems = totalSavedItems;
	}
	public int getTotalViewCount() {
		return totalViewCount;
	}
	public void setTotalViewCount(int totalViewCount) {
		this.totalViewCount = totalViewCount;
	}

	
}
