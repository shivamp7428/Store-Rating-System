const BASE_URL = "http://localhost:5000";

let adminToken = "";
let userToken = "";
let ownerToken = "";

let testUserEmail = "";
const testUserPassword = "Testuser@123";

let testStoreId = null;
let testRatingWasCreated = false;

let passed = 0;
let failed = 0;

const request = async (method, url, token = null, body = undefined) => {
    const options = { method, headers: {} };

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);

    let data = {};
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    return { status: response.status, data };
};

const test = async (name, callback) => {
    try {
        await callback();
        passed++;
        console.log(`✅ PASS — ${name}`);
    } catch (error) {
        failed++;
        console.log(`❌ FAIL — ${name}`);
        console.log(`   ${error.message}`);
    }
};

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const assertStatus = (response, expected) => {
    assert(
        response.status === expected,
        `Expected ${expected}, got ${response.status}`
    );
};

const login = async (email, password) => {
    const response = await request("POST", "/api/auth/login", null, { email, password });

    if (response.status !== 200) {
        throw new Error(`Login failed for ${email}: ${JSON.stringify(response.data)}`);
    }

    assert(typeof response.data.token === "string", "Login response does not contain token");

    return response.data.token;
};

const getUserStores = async () => {
    const response = await request("GET", "/api/user/stores", userToken);

    assertStatus(response, 200);
    assert(Array.isArray(response.data.stores), "stores should be an array");

    return response.data.stores;
};

const main = async () => {
    console.log("\n=================================================");
    console.log("        STORE RATING SYSTEM API TEST SUITE");
    console.log("=================================================\n");

    console.log("========== SETUP ==========\n");

    adminToken = await login("admin@store.com", "Admin@123");
    userToken = await login("testuser123@gmail.com", "Testuser@123");
    ownerToken = await login("owner@store.com", "Owner@123");

    console.log("Tokens loaded successfully.\n");

    console.log("========== AUTHENTICATION ==========\n");

    await test("API 1 — Valid user login", async () => {
        const response = await request("POST", "/api/auth/login", null, {
            email: "testuser123@gmail.com",
            password: "Testuser@123"
        });

        assertStatus(response, 200);
        assert(typeof response.data.token === "string", "Token missing");
    });

    await test("API 2 — Wrong password rejected", async () => {
        const response = await request("POST", "/api/auth/login", null, {
            email: "testuser123@gmail.com",
            password: "WrongPassword@123"
        });

        assertStatus(response, 401);
    });

    await test("API 3 — Non-existent email rejected", async () => {
        const response = await request("POST", "/api/auth/login", null, {
            email: "doesnotexist@example.com",
            password: "Testuser@123"
        });

        assertStatus(response, 401);
    });

    await test("API 4 — Missing login fields rejected", async () => {
        const response = await request("POST", "/api/auth/login", null, {});

        assertStatus(response, 400);
    });

    await test("API 5 — Invalid login email rejected", async () => {
        const response = await request("POST", "/api/auth/login", null, {
            email: "invalid-email",
            password: "Testuser@123"
        });

        assertStatus(response, 400);
    });

    console.log("\n========== SIGNUP VALIDATION ==========\n");

    testUserEmail = `apitest${Date.now()}@example.com`;

    await test("API 6 — Valid signup", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "API Test Normal User",
            email: testUserEmail,
            address: "Bhopal, Madhya Pradesh",
            password: testUserPassword
        });

        assertStatus(response, 201);
    });

    await test("API 7 — Signup name below 20 characters rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Short Name",
            email: `short${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Testuser@123"
        });

        assertStatus(response, 400);
    });

    await test("API 8 — Signup name exactly 20 characters accepted", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "ABCDEFGHIJKLMNOPQRST",
            email: `name20${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Testuser@123"
        });

        assertStatus(response, 201);
    });

    await test("API 9 — Signup name above 60 characters rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "A".repeat(61),
            email: `name61${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Testuser@123"
        });

        assertStatus(response, 400);
    });

    await test("API 10 — Signup address above 400 characters rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "API Address Validation User",
            email: `address${Date.now()}@example.com`,
            address: "A".repeat(401),
            password: "Testuser@123"
        });

        assertStatus(response, 400);
    });

    await test("API 11 — Duplicate signup email rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Another Duplicate User",
            email: "testuser123@gmail.com",
            address: "Bhopal",
            password: "Testuser@123"
        });

        assertStatus(response, 409);
    });

    await test("API 12 — Password below 8 characters rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Password Minimum Test",
            email: `pass8${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Test@12"
        });

        assertStatus(response, 400);
    });

    await test("API 13 — Password exactly 8 characters accepted", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Password Eight Test",
            email: `pass8exact${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Test@123"
        });

        assertStatus(response, 201);
    });

    await test("API 14 — Password above 16 characters rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Password Maximum Test",
            email: `pass16${Date.now()}@example.com`,
            address: "Bhopal",
            password: "TestPassword@123456"
        });

        assertStatus(response, 400);
    });

    await test("API 15 — Password without uppercase rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Password Uppercase Test",
            email: `upper${Date.now()}@example.com`,
            address: "Bhopal",
            password: "testuser@123"
        });

        assertStatus(response, 400);
    });

    await test("API 16 — Password without special character rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Password Special Test",
            email: `special${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Testuser123"
        });

        assertStatus(response, 400);
    });

    await test("API 17 — Invalid signup email rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {
            name: "Invalid Email Validation User",
            email: "invalid-email",
            address: "Bhopal",
            password: "Testuser@123"
        });

        assertStatus(response, 400);
    });

    await test("API 18 — Missing signup fields rejected", async () => {
        const response = await request("POST", "/api/auth/signup", null, {});

        assertStatus(response, 400);
    });

    console.log("\n========== CHANGE PASSWORD ==========\n");

    await test("API 19 — Change password without token rejected", async () => {
        const response = await request("PUT", "/api/auth/change-password", null, {
            currentPassword: testUserPassword,
            newPassword: "Newpass@123"
        });

        assertStatus(response, 401);
    });

    console.log("\n========== ADMIN DASHBOARD ==========\n");

    await test("API 20 — ADMIN can access dashboard", async () => {
        const response = await request("GET", "/api/admin/dashboard", adminToken);

        assertStatus(response, 200);
        assert(typeof response.data.totalUsers === "number", "totalUsers should be number");
        assert(typeof response.data.totalStores === "number", "totalStores should be number");
        assert(typeof response.data.totalRatings === "number", "totalRatings should be number");
    });

    console.log("\n========== ADMIN USER LIST ==========\n");

    await test("API 21 — ADMIN can list users", async () => {
        const response = await request("GET", "/api/admin/users?page=1&limit=10", adminToken);

        assertStatus(response, 200);
        assert(Array.isArray(response.data.users), "users should be array");
    });

    await test("API 22 — Admin user search by name", async () => {
        const response = await request("GET", "/api/admin/users?search=Rahul", adminToken);

        assertStatus(response, 200);
    });

    await test("API 23 — Admin user search by email", async () => {
        const response = await request("GET", "/api/admin/users?search=owner2", adminToken);

        assertStatus(response, 200);
    });

    await test("API 24 — Admin user search by address", async () => {
        const response = await request("GET", "/api/admin/users?search=Bhopal", adminToken);

        assertStatus(response, 200);
    });

    await test("API 25 — Admin user filter by role", async () => {
        const response = await request("GET", "/api/admin/users?role=STORE_OWNER", adminToken);

        assertStatus(response, 200);
        assert(
            response.data.users.every(user => user.role === "STORE_OWNER"),
            "Returned user has incorrect role"
        );
    });

    await test("API 26 — Admin user sort by name DESC", async () => {
        const response = await request(
            "GET",
            "/api/admin/users?sortBy=name&sortOrder=DESC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 27 — Admin user sort by email ASC", async () => {
        const response = await request(
            "GET",
            "/api/admin/users?sortBy=email&sortOrder=ASC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 28 — Admin user pagination", async () => {
        const response = await request("GET", "/api/admin/users?page=1&limit=2", adminToken);

        assertStatus(response, 200);
        assert(response.data.users.length <= 2, "Pagination limit not respected");
    });

    await test("API 29 — Invalid role rejected", async () => {
        const response = await request("GET", "/api/admin/users?role=MANAGER", adminToken);

        assertStatus(response, 400);
        assert(
            response.data.message === "Invalid role",
            `Unexpected response: ${JSON.stringify(response.data)}`
        );
    });

    console.log("\n========== ADMIN STORE LIST ==========\n");

    await test("API 30 — ADMIN can list stores", async () => {
        const response = await request("GET", "/api/admin/stores", adminToken);

        assertStatus(response, 200);
        assert(Array.isArray(response.data.stores), "stores should be array");
    });

    await test("API 31 — Admin store search by name", async () => {
        const response = await request("GET", "/api/admin/stores?search=Bhopal", adminToken);

        assertStatus(response, 200);
    });

    await test("API 32 — Admin store search by email", async () => {
        const response = await request("GET", "/api/admin/stores?search=superstore2", adminToken);

        assertStatus(response, 200);
    });

    await test("API 33 — Admin store search by address", async () => {
        const response = await request("GET", "/api/admin/stores?search=MP%20Nagar", adminToken);

        assertStatus(response, 200);
    });

    await test("API 34 — Admin store sort name ASC", async () => {
        const response = await request(
            "GET",
            "/api/admin/stores?sortBy=name&sortOrder=ASC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 35 — Admin store sort name DESC", async () => {
        const response = await request(
            "GET",
            "/api/admin/stores?sortBy=name&sortOrder=DESC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 36 — Admin store sort email ASC", async () => {
        const response = await request(
            "GET",
            "/api/admin/stores?sortBy=email&sortOrder=ASC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 37 — Admin store sort email DESC", async () => {
        const response = await request(
            "GET",
            "/api/admin/stores?sortBy=email&sortOrder=DESC",
            adminToken
        );

        assertStatus(response, 200);
    });

    await test("API 38 — Admin store pagination", async () => {
        const response = await request("GET", "/api/admin/stores?page=1&limit=2", adminToken);

        assertStatus(response, 200);
        assert(response.data.stores.length <= 2, "Pagination limit not respected");
    });

    await test("API 39 — Invalid store sortBy safely handled", async () => {
        const response = await request("GET", "/api/admin/stores?sortBy=invalid", adminToken);

        assertStatus(response, 200);
    });

    await test("API 40 — Invalid store sortOrder safely handled", async () => {
        const response = await request("GET", "/api/admin/stores?sortOrder=invalid", adminToken);

        assertStatus(response, 200);
    });

    console.log("\n========== ADMIN USER DETAILS ==========\n");

    await test("API 41 — ADMIN can view normal user details", async () => {
        const response = await request("GET", "/api/admin/users/3", adminToken);

        assertStatus(response, 200);
        assert(response.data.user, "User details missing");
    });

    await test("API 42 — ADMIN can view store owner details", async () => {
        const response = await request("GET", "/api/admin/users/4", adminToken);

        assertStatus(response, 200);
        assert(response.data.user, "User details missing");
    });

    await test("API 43 — Non-existent user rejected", async () => {
        const response = await request("GET", "/api/admin/users/999999", adminToken);

        assertStatus(response, 404);
    });

    console.log("\n========== USER STORE APIs ==========\n");

    await test("API 44 — USER can list stores", async () => {
        const userStores = await getUserStores();

        assert(userStores.length > 0, "No stores returned");
        assert("overallRating" in userStores[0], "overallRating missing");
        assert("userRating" in userStores[0], "userRating missing");
    });

    await test("API 45 — USER can search stores by name", async () => {
        const response = await request("GET", "/api/user/stores?search=Bhopal", userToken);

        assertStatus(response, 200);
    });

    await test("API 46 — USER can search stores by address", async () => {
        const response = await request("GET", "/api/user/stores?search=MP%20Nagar", userToken);

        assertStatus(response, 200);
    });

    let stores = await getUserStores();

    const unratedStore = stores.find(
        store => store.userRating === null || store.userRating === undefined
    );

    testStoreId = unratedStore ? unratedStore.id : 3;

    console.log("\n========== RATING VALIDATION ==========\n");

    await test("API 47 — Rating below 1 rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 0 }
        );

        assertStatus(response, 400);
    });

    await test("API 48 — Rating above 5 rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 6 }
        );

        assertStatus(response, 400);
    });

    await test("API 49 — Decimal rating rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 4.5 }
        );

        assertStatus(response, 400);
    });

    await test("API 50 — String rating rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: "five" }
        );

        assertStatus(response, 400);
    });

    await test("API 51 — Missing rating rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            {}
        );

        assertStatus(response, 400);
    });

    console.log("\n========== RATING CRUD ==========\n");

    stores = await getUserStores();

    const currentStore = stores.find(store => store.id === testStoreId);

    await test("API 52 — USER can submit or verify existing valid rating", async () => {
        if (
            currentStore &&
            currentStore.userRating !== null &&
            currentStore.userRating !== undefined
        ) {
            testRatingWasCreated = false;

            assert(
                Number(currentStore.userRating) >= 1 &&
                Number(currentStore.userRating) <= 5,
                "Existing user rating is invalid"
            );

            return;
        }

        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 4 }
        );

        assertStatus(response, 201);

        testRatingWasCreated = true;
    });

    await test("API 53 — Duplicate rating rejected", async () => {
        const response = await request(
            "POST",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 5 }
        );

        assertStatus(response, 409);
    });

    await test("API 54 — USER can modify rating", async () => {
        const response = await request(
            "PUT",
            `/api/user/stores/${testStoreId}/rating`,
            userToken,
            { rating: 5 }
        );

        assertStatus(response, 200);
    });

    await test("API 55 — Updated rating reflected in listing", async () => {
        const updatedStores = await getUserStores();
        const store = updatedStores.find(item => item.id === testStoreId);

        assert(store, "Store not found");
        assert(
            Number(store.userRating) === 5,
            `Expected userRating 5, got ${store.userRating}`
        );
    });

    await test("API 56 — Invalid store ID rejected", async () => {
        const response = await request(
            "POST",
            "/api/user/stores/abc/rating",
            userToken,
            { rating: 4 }
        );

        assertStatus(response, 400);
    });

    await test("API 57 — Non-existent store rejected", async () => {
        const response = await request(
            "POST",
            "/api/user/stores/999999/rating",
            userToken,
            { rating: 4 }
        );

        assertStatus(response, 404);
    });

    console.log("\n========== AUTHORIZATION ==========\n");

    await test("API 58 — USER cannot access admin dashboard", async () => {
        const response = await request("GET", "/api/admin/dashboard", userToken);

        assertStatus(response, 403);
    });

    await test("API 59 — STORE_OWNER cannot access admin dashboard", async () => {
        const response = await request("GET", "/api/admin/dashboard", ownerToken);

        assertStatus(response, 403);
    });

    await test("API 60 — USER cannot access admin users", async () => {
        const response = await request("GET", "/api/admin/users", userToken);

        assertStatus(response, 403);
    });

    await test("API 61 — STORE_OWNER cannot access admin users", async () => {
        const response = await request("GET", "/api/admin/users", ownerToken);

        assertStatus(response, 403);
    });

    await test("API 62 — USER cannot access admin stores", async () => {
        const response = await request("GET", "/api/admin/stores", userToken);

        assertStatus(response, 403);
    });

    await test("API 63 — STORE_OWNER cannot access admin stores", async () => {
        const response = await request("GET", "/api/admin/stores", ownerToken);

        assertStatus(response, 403);
    });

    await test("API 64 — ADMIN cannot access USER stores", async () => {
        const response = await request("GET", "/api/user/stores", adminToken);

        assertStatus(response, 403);
    });

    await test("API 65 — STORE_OWNER cannot access USER stores", async () => {
        const response = await request("GET", "/api/user/stores", ownerToken);

        assertStatus(response, 403);
    });

    await test("API 66 — USER cannot access STORE_OWNER dashboard", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", userToken);

        assertStatus(response, 403);
    });

    await test("API 67 — ADMIN cannot access STORE_OWNER dashboard", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", adminToken);

        assertStatus(response, 403);
    });

    console.log("\n========== AUTHENTICATION SECURITY ==========\n");

    await test("API 68 — USER stores without token rejected", async () => {
        const response = await request("GET", "/api/user/stores");

        assertStatus(response, 401);
    });

    await test("API 69 — Invalid JWT rejected", async () => {
        const response = await request("GET", "/api/user/stores", "invalid.jwt.token");

        assertStatus(response, 401);
    });

    await test("API 70 — Missing bearer token rejected", async () => {
        const response = await fetch(`${BASE_URL}/api/user/stores`, {
            method: "GET",
            headers: { Authorization: "Bearer" }
        });

        const data = await response.json();

        assertStatus(response, 401);
        assert(
            data.message === "Invalid authorization format",
            `Unexpected response: ${JSON.stringify(data)}`
        );
    });

    console.log("\n========== STORE OWNER ==========\n");

    await test("API 71 — STORE_OWNER can access dashboard", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", ownerToken);

        assertStatus(response, 200);
        assert(typeof response.data.averageRating === "number", "averageRating should be number");
        assert(Array.isArray(response.data.stores), "stores should be array");
        assert(Array.isArray(response.data.ratings), "ratings should be array");
    });

    await test("API 72 — Owner dashboard contains store rating information", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", ownerToken);

        assertStatus(response, 200);
        assert(response.data.stores.length > 0, "Owner has no stores");

        const store = response.data.stores[0];

        assert("averageRating" in store, "averageRating missing");
        assert("totalRatings" in store, "totalRatings missing");
    });

    await test("API 73 — Owner dashboard rating users contain user information", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", ownerToken);

        assertStatus(response, 200);

        if (response.data.ratings.length > 0) {
            const rating = response.data.ratings[0];

            assert("userId" in rating, "userId missing");
            assert("userName" in rating, "userName missing");
            assert("userEmail" in rating, "userEmail missing");
            assert("rating" in rating, "rating missing");
        }
    });

    console.log("\n========== ADMIN CREATE USER ==========\n");

    await test("API 74 — ADMIN can create USER", async () => {
        const response = await request("POST", "/api/admin/users", adminToken, {
            name: "API Created Normal User",
            email: `admincreate${Date.now()}@example.com`,
            address: "Bhopal, Madhya Pradesh",
            password: "Testuser@123",
            role: "USER"
        });

        assertStatus(response, 201);
    });

    await test("API 75 — ADMIN can create ADMIN", async () => {
        const response = await request("POST", "/api/admin/users", adminToken, {
            name: "API Created System Administrator",
            email: `admincreate2${Date.now()}@example.com`,
            address: "Bhopal, Madhya Pradesh",
            password: "Adminpass@123",
            role: "ADMIN"
        });

        assertStatus(response, 201);
    });

    await test("API 76 — ADMIN can create STORE_OWNER", async () => {
        const response = await request("POST", "/api/admin/users", adminToken, {
            name: "API Created Store Owner",
            email: `ownercreate${Date.now()}@example.com`,
            address: "Bhopal, Madhya Pradesh",
            password: "Ownerpass@123",
            role: "STORE_OWNER"
        });

        assertStatus(response, 201);
    });

    await test("API 77 — Invalid admin-created user role rejected", async () => {
        const response = await request("POST", "/api/admin/users", adminToken, {
            name: "Invalid Role Created User",
            email: `invalidrole${Date.now()}@example.com`,
            address: "Bhopal",
            password: "Testuser@123",
            role: "MANAGER"
        });

        assertStatus(response, 400);
    });

    await test("API 78 — Duplicate admin-created user email rejected", async () => {
        const response = await request("POST", "/api/admin/users", adminToken, {
            name: "Duplicate Email Admin User",
            email: "testuser123@gmail.com",
            address: "Bhopal",
            password: "Testuser@123",
            role: "USER"
        });

        assertStatus(response, 409);
    });

    console.log("\n========== ADMIN CREATE STORE ==========\n");

    await test("API 79 — USER cannot create store", async () => {
        const response = await request("POST", "/api/admin/stores", userToken, {
            name: "Unauthorized Store Creation",
            email: `unauthorized${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 403);
    });

    await test("API 80 — STORE_OWNER cannot create store", async () => {
        const response = await request("POST", "/api/admin/stores", ownerToken, {
            name: "Owner Unauthorized Store",
            email: `ownerunauth${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 403);
    });

    await test("API 81 — Store name below 20 rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "Short Store",
            email: `shortstore${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 400);
    });

    await test("API 82 — Store name above 60 rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "A".repeat(61),
            email: `longstore${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 400);
    });

    await test("API 83 — Store address above 400 rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "API Address Validation Store",
            email: `storeaddress${Date.now()}@example.com`,
            address: "A".repeat(401),
            ownerId: 4
        });

        assertStatus(response, 400);
    });

    await test("API 84 — Invalid store email rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "API Invalid Email Store",
            email: "invalid-email",
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 400);
    });

    await test("API 85 — Non-existent store owner rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "API Invalid Owner Store",
            email: `invalidowner${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 999999
        });

        assertStatus(response, 400);
    });

    await test("API 86 — Normal USER cannot be store owner", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "API Normal User Owner Store",
            email: `normalowner${Date.now()}@example.com`,
            address: "Bhopal",
            ownerId: 3
        });

        assertStatus(response, 400);
        assert(
            response.data.message === "Invalid store owner",
            `Unexpected response: ${JSON.stringify(response.data)}`
        );
    });

    await test("API 87 — Duplicate store email rejected", async () => {
        const response = await request("POST", "/api/admin/stores", adminToken, {
            name: "Duplicate Store Email Test",
            email: "bhopalsuper@store.com",
            address: "Bhopal",
            ownerId: 4
        });

        assertStatus(response, 409);
    });

    console.log("\n========== FINAL AUTHORIZATION ==========\n");

    await test("API 88 — USER cannot access admin user details", async () => {
        const response = await request("GET", "/api/admin/users/3", userToken);

        assertStatus(response, 403);
    });

    await test("API 89 — STORE_OWNER cannot access admin user details", async () => {
        const response = await request("GET", "/api/admin/users/3", ownerToken);

        assertStatus(response, 403);
    });

    await test("API 90 — USER cannot access store-owner dashboard", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", userToken);

        assertStatus(response, 403);
    });

    await test("API 91 — ADMIN cannot access store-owner dashboard", async () => {
        const response = await request("GET", "/api/store-owner/dashboard", adminToken);

        assertStatus(response, 403);
    });

    console.log("\n=================================================");
    console.log("                 TEST SUMMARY");
    console.log("=================================================\n");

    console.log(`Total Passed : ${passed}`);
    console.log(`Total Failed : ${failed}`);
    console.log(`Total Tests  : ${passed + failed}`);

    if (failed === 0) {
        console.log("\n ALL API TESTS PASSED!\n");
    } else {
        console.log(`\n${failed} TEST(S) FAILED — FIX BEFORE SUBMISSION.\n`);
    }

    console.log("=================================================\n");
};

main().catch(error => {
    console.error("\n❌ TEST RUNNER ERROR");
    console.error(error);
});