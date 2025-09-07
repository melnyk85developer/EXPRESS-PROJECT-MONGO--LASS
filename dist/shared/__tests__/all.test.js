"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const contextTests_1 = require("./contextTests");
const authServices_1 = require("../../../src/services/auth/authServices");
const app_1 = require("../../app");
const uuid = __importStar(require("uuid"));
const iocRoot_1 = require("../container/iocRoot");
const db_1 = require("../../db");
const authTestManager_1 = require("./managersTests/authTestManager");
const usersServices_1 = require("../../services/users/usersServices");
const emailAdapter_1 = require("../../../src/shared/infrastructure/emailAdapter");
const securityDeviceService_1 = require("../../../src/services/usersSessions/securityDeviceService");
const tokenService_1 = require("../../../src/shared/infrastructure/tokenService");
const settings_1 = require("../../../src/shared/settings");
const testing_E2E_Auth_api_1 = require("../../../src/services/auth/testingAuth/testing-E2E-Auth.api");
const testing_INTEGRATION_Auth_api_1 = require("../../../src/services/auth/testingAuth/testing-INTEGRATION-Auth.api");
const testing_E2E_UserSessions_api_1 = require("../../../src/services/usersSessions/testingUserSessions/testing-E2E-UserSessions.api");
const testing_INTEGRATION_UsersSessions_api_1 = require("../../../src/services/usersSessions/testingUserSessions/testing-INTEGRATION-UsersSessions.api");
const confirmationRepository_1 = require("../../services/confirmation/confirmationRepository/confirmationRepository");
const initilizationContext = () => {
    contextTests_1.contextTests.buff2 = Buffer.from(settings_1.SETTINGS.ADMIN, 'utf8');
    contextTests_1.contextTests.codedAuth = contextTests_1.contextTests.buff2.toString('base64');
    contextTests_1.contextTests.invalidToken = '245678901245678901123456';
    contextTests_1.contextTests.expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoicGFzc3dvcmQiLCJ1c2VySWQiOiI2NzJhMzdmMDkzZDUzMjFmNGZjNjE5M2UiLCJpYXQiOjE3MzA4MjAwODUsImV4cCI6MTczMDgyMDk4NX0.lpZlmruicYbzJ_y3k8rkyAYWnFlpwEhjG2e1K6jFGSk';
    contextTests_1.contextTests.payload = '245678901245678901123456';
    contextTests_1.contextTests.invalidId = '66b9413d36f75d0b44ad1c5a';
    contextTests_1.contextTests.randomId = uuid.v4();
    contextTests_1.contextTests.app = app_1.app;
    contextTests_1.contextTests.mongoDBCollection = iocRoot_1.container.get(db_1.MongoDBCollection);
    contextTests_1.contextTests.authServices = iocRoot_1.container.get(authServices_1.AuthServices);
    contextTests_1.contextTests.userService = iocRoot_1.container.get(usersServices_1.UserService);
    contextTests_1.contextTests.mailService = iocRoot_1.container.get(emailAdapter_1.MailService);
    contextTests_1.contextTests.usersSessionService = iocRoot_1.container.get(securityDeviceService_1.SecurityDeviceServices);
    contextTests_1.contextTests.tokenService = iocRoot_1.container.get(tokenService_1.TokenService);
    contextTests_1.contextTests.confirmationRepository = iocRoot_1.container.get(confirmationRepository_1.ConfirmationRepository);
    contextTests_1.contextTests.total_number_of_active_sessions_in_tests = 0;
    contextTests_1.contextTests.userAgent = [
        // 📱 iPhone 15 Pro (iOS 17, Safari)
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        // 📱 Samsung Galaxy S24 (Android 14, Chrome)
        'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
        // 📱 Google Pixel 8 Pro (Android 14, Chrome)
        'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Mobile Safari/537.36',
        // 💻 Windows 11 (Chrome)
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
        // 💻 macOS Sonoma (Safari)
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        // 💻 Ubuntu 24.04 LTS (Firefox)
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
        // 💻 Macbook M3 Pro (Edge)
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 Edg/125.0.2535.67',
        // 📱 iPad Pro M2 (iPadOS 17, Safari)
        'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        // 📺 Smart TV Samsung Tizen OS
        'Mozilla/5.0 (SMART-TV; Linux; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/5.1 TV Safari/537.36',
        // 📺 Android TV (Sony Bravia, Android 12)
        'Mozilla/5.0 (Linux; Android 12; BRAVIA 4K UR3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.0 Safari/537.36',
        // 🕹️ Steam Deck (SteamOS 3, Chrome)
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36 SteamOS/3.0 SteamDeck/1.0',
        // 📱 Xiaomi 14 Ultra (HyperOS, Android 14)
        'Mozilla/5.0 (Linux; Android 14; Xiaomi 23127PN0CC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Mobile Safari/537.36'
    ];
    contextTests_1.contextTests.correctUserName1 = 'Maksym';
    contextTests_1.contextTests.correctUserSurName1 = 'Melnyk';
    contextTests_1.contextTests.correctUserEmail1 = 'webmars@example.com';
    contextTests_1.contextTests.correctUserPassword1 = 'password';
    contextTests_1.contextTests.correctBlogNsme1 = 'MyBlog';
    contextTests_1.contextTests.correctBlogDescription1 = 'Description blog';
    contextTests_1.contextTests.correctWebsiteUrl1 = 'https://webmars.com';
    contextTests_1.contextTests.correctTitleBlog1Post1 = 'My Post1 Title';
    contextTests_1.contextTests.shortDescriptionBlog1Post1 = 'MyPost 1 - shortDescription';
    contextTests_1.contextTests.contentBlog1Post1 = "content 1 content 1 content 1 content 1 content";
    contextTests_1.contextTests.correctTitleBlog1Post2 = 'My Post Title2';
    contextTests_1.contextTests.shortDescriptionBlog1Post2 = 'MyPost - 2 shortDescription';
    contextTests_1.contextTests.contentBlog1Post2 = "content 2 content 2 content 2 content 2 content";
    contextTests_1.contextTests.contentBlog1Post1Comment1 = 'Комментарий test1 content1';
    contextTests_1.contextTests.contentBlog1Post1Comment2 = 'Комментарий test2 content2';
    contextTests_1.contextTests.contentBlog1Post1Comment3 = 'Комментарий test3 content3';
    contextTests_1.contextTests.correctUserName2 = 'Viktor';
    contextTests_1.contextTests.correctUserSurName2 = 'Melnyk';
    contextTests_1.contextTests.correctUserEmail2 = 'webmars2@example.com';
    contextTests_1.contextTests.correctUserPassword2 = 'password2';
    contextTests_1.contextTests.correctBlogNsme2 = 'ViktorBlog';
    contextTests_1.contextTests.correctBlogDescription2 = 'Description ViktorBlog';
    contextTests_1.contextTests.correctWebsiteUrl2 = 'https://example.com';
    contextTests_1.contextTests.correctTitleBlog1Post3 = 'Viktor post Title update post';
    contextTests_1.contextTests.shortDescriptionBlog1Post3 = 'Viktor post shortDescription update post';
    contextTests_1.contextTests.contentBlog1Post3 = "content 3 content 3 content 3 content 3 content update post";
    contextTests_1.contextTests.correctUserName3 = 'Nataly';
    contextTests_1.contextTests.correctUserSurName3 = 'Melnyk';
    contextTests_1.contextTests.correctUserEmail3 = 'webmars3@example.com';
    contextTests_1.contextTests.correctUserPassword3 = 'password3';
    contextTests_1.contextTests.correctBlogNsme2 = 'NataliBlog';
    contextTests_1.contextTests.correctBlogDescription2 = 'description';
    contextTests_1.contextTests.correctWebsiteUrl2 = 'https://example.com';
    contextTests_1.contextTests.correctUserName4 = 'Aleksandra';
    contextTests_1.contextTests.correctUserSurName4 = 'Melnyk';
    contextTests_1.contextTests.correctUserEmail4 = 'webmars3@example.com';
    contextTests_1.contextTests.correctUserPassword4 = 'password3';
    contextTests_1.contextTests.correctBlogNsme4 = 'AleksandraBlog';
    contextTests_1.contextTests.correctBlogDescription4 = 'Description AleksandraBlog';
    contextTests_1.contextTests.correctWebsiteUrl4 = 'https://example.com';
};
const delay = (milliseconds) => new Promise((resolve) => {
    return setTimeout(() => resolve(true), milliseconds);
});
exports.delay = delay;
// export const getRequest = () => {
//     return request(app);
// }
describe('ALL TESTS IT-INCUBATOR PROJEKT', () => {
    initilizationContext();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, authTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
    }));
    describe('AUTH-BLOCK-TESTS', () => {
        (0, testing_E2E_Auth_api_1.authE2eTest)();
        (0, testing_INTEGRATION_Auth_api_1.authIntegrationTest)();
        // authUnitTest()
    });
    describe('USER-SESSIONS-BLOCK-TESTS', () => {
        (0, testing_E2E_UserSessions_api_1.usersSessionsE2eTest)();
        (0, testing_INTEGRATION_UsersSessions_api_1.usersSessionsInegrationTest)();
    });
    // describe('CONFIRMATION-BLOCK-TESTS', () => {
    //     resetPasswordInegrationTest()
    // })
    // describe('BLOGS-BLOCK-TESTS', () => {
    //     blogsE2eTest()
    // })
    // describe('POSTS-BLOCK-TESTS', () => {
    //     postsE2eTest()
    // })
    // describe('COMMENTS-BLOCK-TESTS', () => {
    //     commentsE2eTest()
    // })
    // describe('USERS-BLOCK-TESTS', () => {
    //     usersE2eTest()
    // })
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoDB = iocRoot_1.container.get(db_1.MongoDBCollection);
        yield mongoDB.close();
        const mailService = iocRoot_1.container.get(emailAdapter_1.MailService);
        mailService.closeTransporter();
    }));
});
