
const Store = require("electron-store");
const store = new Store();

module.exports = {
    saveAuth(email, accessToken, userId) {
        store.set("auth", {
            email,
            access_token: accessToken,
            user_id: userId
        });
    },

    loadAuth() {
        return store.get("auth");
    },

    clearAuth() {
        store.delete("auth");
    },

    isLoggedIn() {
        const token = store.get("auth.access_token");
        return typeof token === "string" && token.length > 0;
    }
};
