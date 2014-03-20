package endpoint;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.List;

import endpoint.DatastoreObject;
import endpoint.Index;
import endpoint.utils.DateUtils;

public class SimpleObject extends DatastoreObject {
	private int aInt;

	@Index
	private long aLong;

	private double aDouble;

	private boolean aBoolean;

	private Date aDate;

	@Index(normalize = true)
	private String aString;

	private List<AnotherSimpleObject> aList;

	@Json
	private NotADatastoreObject notADatastoreObject;

	@Json
	private List<NotADatastoreObject> notADatastoreObjectList;

	private transient String changeInCallback;

	public SimpleObject() {

	}

	public SimpleObject(String aString) {
		this.aString = aString;
	}

	public SimpleObject(int aInt, long aLong, double aDouble, boolean aBoolean, Date aDate, String aString) {
		super();
		this.aInt = aInt;
		this.aLong = aLong;
		this.aDouble = aDouble;
		this.aBoolean = aBoolean;
		this.aDate = aDate;
		this.aString = aString;
	}

	public int getaInt() {
		return aInt;
	}

	public void setaInt(int aInt) {
		this.aInt = aInt;
	}

	public long getaLong() {
		return aLong;
	}

	public void setaLong(long aLong) {
		this.aLong = aLong;
	}

	public double getaDouble() {
		return aDouble;
	}

	public void setaDouble(double aDouble) {
		this.aDouble = aDouble;
	}

	public boolean isaBoolean() {
		return aBoolean;
	}

	public void setaBoolean(boolean aBoolean) {
		this.aBoolean = aBoolean;
	}

	public Date getaDate() {
		return aDate;
	}

	public void setaDate(Date aDate) {
		this.aDate = aDate;
	}

	public String getaString() {
		return aString;
	}

	public void setaString(String aString) {
		this.aString = aString;
	}

	public List<AnotherSimpleObject> getaList() {
		return aList;
	}

	public void setaList(List<AnotherSimpleObject> aList) {
		this.aList = aList;
	}

	public NotADatastoreObject getNotADatastoreObject() {
		return notADatastoreObject;
	}

	public void setNotADatastoreObject(NotADatastoreObject notADatastoreObject) {
		this.notADatastoreObject = notADatastoreObject;
	}

	public List<NotADatastoreObject> getNotADatastoreObjectList() {
		return notADatastoreObjectList;
	}

	public void setNotADatastoreObjectList(List<NotADatastoreObject> notADatastoreObjectList) {
		this.notADatastoreObjectList = notADatastoreObjectList;
	}

	public String getChangeInCallback() {
		return changeInCallback;
	}

	public void setChangeInCallback(String changeInCallback) {
		this.changeInCallback = changeInCallback;
	}

	public void assertObject(int aInt, long aLong, double aDouble, boolean aBoolean, String timestamp, String aString) {
		assertEquals(SimpleObject.class.getSimpleName(), getKey().getKind());
		assertFields(aInt, aLong, aDouble, aBoolean, timestamp, aString);
	}

	public void assertObjectWithoutKey(int aInt, long aLong, double aDouble, boolean aBoolean, String timestamp, String aString) {
		assertFields(aInt, aLong, aDouble, aBoolean, timestamp, aString);
	}

	private void assertFields(int aInt, long aLong, double aDouble, boolean aBoolean, String timestamp, String aString) {
		assertEquals(aInt, getaInt());
		assertEquals(aLong, getaLong());
		assertEquals(aDouble, getaDouble(), 0);
		assertEquals(aBoolean, isaBoolean());
		assertEquals(DateUtils.toTimestamp(timestamp), getaDate());
		assertEquals(aString, getaString());
	}

}