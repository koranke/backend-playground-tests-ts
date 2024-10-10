# BACKEND PLAYGROUND TESTS

This is a companion project to the [Backend Playground](https://github.com/koranke/backend-playground) project. 
It contains system-level tests for the backend playground project, which can be triggered by a CI/CD pipeline for
automated inclusion of typical QA testing of backend services.

This project is intended to be used for testing and demonstration purposes only.  It demonstrates different patterns for handling API testing.

To run tests locally, first check out the Backend Playground project and follow instructions there to build and deploy to Docker.
You will need to also add environment variables for the desired DB_USER and DB_PASSWORD values.  Once the application is deployed and running,
you can run these tests directly in your IDE, or through the command line using the following command:

```shell
npx jest
```

## Technologies
* Jest for test execution and assertions.
* Winston for logging.  Each run generates a new log file in the `logs` directory.  Prior logs are archived.
* Node-config-ts library for configuration management.
* TypeORM for SQL database access, including Db classes for grouping database access methods per data entity.
* Fetch for the API client.

## Design Considerations
The goal of any automation framework should be to minimize the cost of writing, running and maintaining tests.
It is not enough to simply have standard features like logging, a database access layer and an API wrapper.  If 
components are not
designed properly, if they do not sufficiently handle the underlying complexity of the system, if they are not flexible
enough to be both easy to use and at the same time powerful enough to handle the most complex test scenarios, then the
tests that utilize the framework will be more complex than needed and the framework itself may be subject to increasingly
disjointed updates and additions, leading to a more difficult framework to use and maintain.
Other considerations include discoverability, reliability and speed of execution.

One design approach that can help with flexibility and complexity is to use a "configuration" style approach for features as
opposed to a more procedural approach.  Features can be expressed as objects with configuration properties that can be
set to control behavior.  This allows for a more declarative style of test writing, where the tests
can focus on the "what" of the test and not the "how".  This can lead to more readable tests that are easier to
maintain and understand.

Two examples of this approach in this project are the "Api" classes and the "DataScenario" classes.

### Api Classes
All endpoints are exposed as objects with configuration for the standard parameters of an API call.  Default values
can be set per endpoint, and these defaults can be overridden by the test.  Tests have two needs when
making an API call: 1) to test the endpoint, and 2) to use the endpoint as part of data scenario setup or verification.
There are two core methods that support these needs: "call" and "tryCall".  The "call" method is used when the test
expects the call to succeed.  It automatically verifies the expected response code and returns the
deserialized response body.   The "tryCall" method is used when the test expects the call to fail or when the test
needs access to the "Response" object for more complex handling.

Call Example:
```Typescript
const user = await UserService.getById(id).call()
```

TryCall Example:
```Typescript
await UserService.getById(invalidId).tryCall().then(async (response) => {
    expect(response.status).toBe(404)
    expect(response.text()).resolves.toBe('User with id ' + invalidId + ' does not exist')
})
```

Example of configuring an endpoint:
```Typescript
const user = await UserService.getById(id)
        .withHeader("Authorization", "Bearer " + token)
        .call();
```

### Data Scenario Classes
Data scenario classes are the main means of modeling the complexity of the application under test, 
centralizing business logic and workflows while hiding the details
from the test itself.  They are used to set up test data and can also be used to help verify expected results.
Data scenarios are focused around business entities and the relationships between them.  One data scenario can
have one or more child data scenarios, which can be used to model complex workflows.  Data scenarios can be
configured with default values, which can be overridden by the test.  Since a data scenario "knows" about all
the data details behind a particular scenario, it can be used to help verify expected results.  Data scenarios can
also be used to transform data into different formats, such as converting a list of entities into a map for
easier access or returning the data as a JSON string or as an object.
The beauty of data scenarios is that they can be as simple or complex as needed within a test.  They can be a single line
of code or can be a series of configurations.

Example using default and random values
```Typescript
const userScenario = await new UserScenario().create()
```

Example overriding default and random values
```Typescript
const userScenario = await new UserScenario()
    .withUsername("J.J.Jones")
    .withPassword("myPassword")
    .withNumberOfPosts(1)
    .create();
```