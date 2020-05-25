import AuthController from './AuthController';

describe("AuthController: Login", () => {
    test("empty username and password", async () => {
        const result = await AuthController.login("", "");
        expect(result).toEqual(-2);
    });
});

describe("AuthController: ChangePassword", () => {
    test("empty old and new password", async () => {
        const result = await AuthController.changePassword("", "", "");
        expect(result).toEqual(0);
    });
});