package com.xoftex.parthub.payload.response;

public class CompanyInfoResponse {

	private Long id;
	private String name;
	private byte[] icon;



	public CompanyInfoResponse() {

	}

	public CompanyInfoResponse(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	
	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public byte[] getIcon() {
		return icon;
	}

	public void setIcon(byte[] icon) {
		this.icon = icon;
	}

}
