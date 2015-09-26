package io.yawp.driver.postgresql;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;

@Endpoint(path = "/people")
public class Person {

	private IdRef<Person> id;

	private String name;

	protected IdRef<Person> getId() {
		return id;
	}

	protected void setId(IdRef<Person> id) {
		this.id = id;
	}

	protected String getName() {
		return name;
	}

	protected void setName(String name) {
		this.name = name;
	}

}
