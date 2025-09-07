import { MongoDBCollection } from "../../db";
import { AuthServices } from "../../services/auth/authServices";
import { UserService } from "../../services/users/usersServices";
import { SecurityDeviceServices } from "../../services/usersSessions/securityDeviceService";
import { MailService } from "../infrastructure/emailAdapter";
import { TokenService } from "../infrastructure/tokenService";

export type contextTestsType = {
    userAgent: contextUserAgent;
    buff2: any
    codedAuth: any
    total_number_of_active_sessions_in_tests: number
    payload: string
    invalidToken: string
    expiredToken: string
    randomId: string
    invalidId: string

    app: any
    mongoDBCollection: MongoDBCollection
    usersCollection: any
    blogsCollection: any
    postsCollection: any
    commentsCollection: any
    tokensCollection: any
    requestsCollection: any
    devicesCollection: any

    authServices: AuthServices
    userService: UserService
    mailService: MailService
    usersSessionService: SecurityDeviceServices
    tokenService: TokenService

    confirmationRepository: any

    correctBlogNsme1: string
    correctBlogDescription1: string
    correctWebsiteUrl1: string

    createdBlog1: any,
    createdBlog1Post1: any,
    correctTitleBlog1Post1: any,
    shortDescriptionBlog1Post1: any,
    contentBlog1Post1: any,
    blogIdBlog1Post1: any,
    createdBlog1Post1Comment1: any,
    contentBlog1Post1Comment1: any,
    postIdBlog1Post1Comment1: any

    createdBlog1Post1Comment2: any,
    contentBlog1Post1Comment2: any,
    postIdBlog1Post1Comment2: any

    createdBlog1Post1Comment3: any,
    contentBlog1Post1Comment3: any,
    postIdBlog1Post1Comment3: any

    createdBlog1Post1Comment4: any,
    contentBlog1Post1Comment4: any,
    postIdBlog1Post1Comment4: any

    createdBlog1Post2: any,
    correctTitleBlog1Post2: any,
    shortDescriptionBlog1Post2: any,
    contentBlog1Post2: any,
    blogIdBlog1Post2: any,
    createdBlog1Post2Comment1: any,
    createdBlog1Post2Comment2: any,
    createdBlog1Post2Comment3: any,
    createdBlog1Post2Comment4: any,
    createdBlog1Post3: any,
    correctTitleBlog1Post3: any,
    shortDescriptionBlog1Post3: any,
    contentBlog1Post3: any,
    blogIdBlog1Post3: any,
    createdBlog1Post3Comment1: any,
    createdBlog1Post3Comment2: any,
    createdBlog1Post3Comment3: any,
    createdBlog1Post3Comment4: any,
    createdBlog1Post4: any,
    correctTitleBlog1Post4: any,
    shortDescriptionBlog1Post4: any,
    contentBlog1Post4: any,
    blogIdBlog1Post4: any,
    createdBlog1Post4Comment1: any,
    createdBlog1Post4Comment2: any,
    createdBlog1Post4Comment3: any,
    createdBlog1Post4Comment4: any,

    createdUser1: any;
    userParams: string

    session1User1: any | null;
    accessTokenUser1Device1: string | null;
    refreshTokenUser1Device1: string | null;
    createdDialog1: any,
    createdMessage1: any
    createdMessage2: any
    createdMessage3: any

    session2User1: any | null;
    accessTokenUser1Device2: string;
    refreshTokenUser1Device2: string;

    session3User1: any | null;
    accessTokenUser1Device3: string | null;
    refreshTokenUser1Device3: string | null;

    session4User1: any | null;
    accessTokenUser1Device4: string;
    refreshTokenUser1Device4: string;

    correctUserName1: string;
    correctUserSurName1: string;
    correctUserEmail1: string;
    correctUserPassword1: string;
    createdPost1User1: any
    createdPost1User2: any

    createdUser2: any;
    accessTokenUser2Device1: string;
    refreshTokenUser2Device1: string;
    session1User2: any;
    correctUserName2: string;
    correctUserSurName2: string;
    correctUserEmail2: string;
    correctUserPassword2: string;

    correctBlogNsme2: string
    correctBlogDescription2: string
    correctWebsiteUrl2: string,

    createdBlog2: any,
    createdBlog2Post1: any,
    correctTitleBlog2Post1: '',
    shortDescriptionBlog2Post1: '',
    contentBlog2Post1: '',
    blogIdBlog2Post1: '',
    createdBlog2Post1Comment1: any,
    createdBlog2Post1Comment2: any,
    createdBlog2Post1Comment3: any,
    createdBlog2Post1Comment4: any,
    createdBlog2Post2: any,
    correctTitleBlog2Post2: '',
    shortDescriptionBlog2Post2: '',
    contentBlog2Post2: '',
    blogIdBlog2Post2: '',
    createdBlog2Post2Comment1: any,
    createdBlog2Post2Comment2: any,
    createdBlog2Post2Comment3: any,
    createdBlog2Post2Comment4: any,
    createdBlog2Post3: any,
    correctTitleBlog2Post3: '',
    shortDescriptionBlog2Post3: '',
    contentBlog2Post3: '',
    blogIdBlog2Post3: '',
    createdBlog2Post3Comment1: any,
    createdBlog2Post3Comment2: any,
    createdBlog2Post3Comment3: any,
    createdBlog2Post3Comment4: any,
    createdBlog2Post4: any,
    correctTitleBlog2Post4: '',
    shortDescriptionBlog2Post4: '',
    contentBlog2Post4: '',
    blogIdBlog2Post4: '',
    createdBlog2Post4Comment1: any,
    createdBlog2Post4Comment2: any,
    createdBlog2Post4Comment3: any,
    createdBlog2Post4Comment4: any,

    createdUser3: any,
    accessTokenUser3Device1: string;
    refreshTokenUser3Device1: string;
    session1User3: any;

    correctUserName3: string;
    correctUserSurName3: string;
    correctUserEmail3: string;
    correctUserPassword3: string;

    correctBlogNsme3: string
    correctBlogDescription3: string
    correctWebsiteUrl3: string,

    createdBlog3: any,
    createdBlog3Post1: any,
    correctTitleBlog3Post1: '',
    shortDescriptionBlog3Post1: '',
    contentBlog3Post1: '',
    blogIdBlog3Post1: '',
    createdBlog3Post1Comment1: any,
    createdBlog3Post1Comment2: any,
    createdBlog3Post1Comment3: any,
    createdBlog3Post1Comment4: any,
    createdBlog3Post2: any,
    correctTitleBlog3Post2: '',
    shortDescriptionBlog3Post2: '',
    contentBlog3Post2: '',
    blogIdBlog3Post2: '',
    createdBlog3Post2Comment1: any,
    createdBlog3Post2Comment2: any,
    createdBlog3Post2Comment3: any,
    createdBlog3Post2Comment4: any,
    createdBlog3Post3: any,
    correctTitleBlog3Post3: '',
    shortDescriptionBlog3Post3: '',
    contentBlog3Post3: '',
    blogIdBlog3Post3: '',
    createdBlog3Post3Comment1: any,
    createdBlog3Post3Comment2: any,
    createdBlog3Post3Comment3: any,
    createdBlog3Post3Comment4: any,
    createdBlog3Post4: any,
    correctTitleBlog3Post4: '',
    shortDescriptionBlog3Post4: '',
    contentBlog3Post4: '',
    blogIdBlog3Post4: '',
    createdBlog3Post4Comment1: any,
    createdBlog3Post4Comment2: any,
    createdBlog3Post4Comment3: any,
    createdBlog3Post4Comment4: any,

    createdUser4: any,
    accessTokenUser4Device1: string;
    refreshTokenUser4Device1: string;
    session1User4: any;

    correctUserName4: string;
    correctUserSurName4: string;
    correctUserEmail4: string;
    correctUserPassword4: string;

    correctBlogNsme4: string
    correctBlogDescription4: string
    correctWebsiteUrl4: string,

    createdBlog4: any,
    createdBlog4Post1: any,
    correctTitleBlog4Post1: '',
    shortDescriptionBlog4Post1: '',
    contentBlog4Post1: '',
    blogIdBlog4Post1: '',
    createdBlog4Post1Comment1: any,
    createdBlog4Post1Comment2: any,
    createdBlog4Post1Comment3: any,
    createdBlog4Post1Comment4: any,
    createdBlog4Post2: any,
    correctTitleBlog4Post2: '',
    shortDescriptionBlog4Post2: '',
    contentBlog4Post2: '',
    blogIdBlog4Post2: '',
    createdBlog4Post2Comment1: any,
    createdBlog4Post2Comment2: any,
    createdBlog4Post2Comment3: any,
    createdBlog4Post2Comment4: any,
    createdBlog4Post3: any,
    correctTitleBlog4Post3: '',
    shortDescriptionBlog4Post3: '',
    contentBlog4Post3: '',
    blogIdBlog4Post3: '',
    createdBlog4Post3Comment1: any,
    createdBlog4Post3Comment2: any,
    createdBlog4Post3Comment3: any,
    createdBlog4Post3Comment4: any,
    createdBlog4Post4: any,
    correctTitleBlog4Post4: '',
    shortDescriptionBlog4Post4: '',
    contentBlog4Post4: '',
    blogIdBlog4Post4: '',
    createdBlog4Post4Comment1: any,
    createdBlog4Post4Comment2: any,
    createdBlog4Post4Comment3: any,
    createdBlog4Post4Comment4: any,

}
export type contextUserAgent = any[]
export const contextTests: contextTestsType = {
    userAgent: [],
    buff2: null,
    codedAuth: null,
    total_number_of_active_sessions_in_tests: 0,
    payload: '',
    invalidToken: '',
    expiredToken: '',
    randomId: '',
    invalidId: '',

    app: null,
    mongoDBCollection: null as unknown as MongoDBCollection,
    usersCollection: null,
    blogsCollection: null,
    postsCollection: null,
    commentsCollection: null,
    tokensCollection: null,
    requestsCollection: null,
    devicesCollection: null,

    authServices: null as unknown as AuthServices,
    userService: null as unknown as UserService,
    mailService: null as unknown as MailService,
    usersSessionService: null as unknown as SecurityDeviceServices,
    tokenService: null as unknown as TokenService,

    confirmationRepository: null,

    correctBlogNsme1: '',
    correctBlogDescription1: '',
    correctWebsiteUrl1: '',

    createdBlog1: null,
    createdBlog1Post1: null,
    correctTitleBlog1Post1: '',
    shortDescriptionBlog1Post1: '',
    contentBlog1Post1: '',
    blogIdBlog1Post1: '',

    createdBlog1Post1Comment1: null,
    contentBlog1Post1Comment1: '',
    postIdBlog1Post1Comment1: '',

    createdBlog1Post1Comment2: null,
    contentBlog1Post1Comment2: '',
    postIdBlog1Post1Comment2: '',

    createdBlog1Post1Comment3: null,
    contentBlog1Post1Comment3: '',
    postIdBlog1Post1Comment3: '',

    createdBlog1Post1Comment4: null,
    contentBlog1Post1Comment4: '',
    postIdBlog1Post1Comment4: '',

    createdBlog1Post2: null,
    correctTitleBlog1Post2: '',
    shortDescriptionBlog1Post2: '',
    contentBlog1Post2: '',
    blogIdBlog1Post2: '',
    createdBlog1Post2Comment1: null,
    createdBlog1Post2Comment2: null,
    createdBlog1Post2Comment3: null,
    createdBlog1Post2Comment4: null,
    createdBlog1Post3: null,
    correctTitleBlog1Post3: '',
    shortDescriptionBlog1Post3: '',
    contentBlog1Post3: '',
    blogIdBlog1Post3: '',
    createdBlog1Post3Comment1: null,
    createdBlog1Post3Comment2: null,
    createdBlog1Post3Comment3: null,
    createdBlog1Post3Comment4: null,
    createdBlog1Post4: null,
    correctTitleBlog1Post4: '',
    shortDescriptionBlog1Post4: '',
    contentBlog1Post4: '',
    blogIdBlog1Post4: '',
    createdBlog1Post4Comment1: null,
    createdBlog1Post4Comment2: null,
    createdBlog1Post4Comment3: null,
    createdBlog1Post4Comment4: null,

    createdUser1: null,
    userParams: '',
    session1User1: null,
    accessTokenUser1Device1: '',
    refreshTokenUser1Device1: '',
    createdDialog1: null,
    createdMessage1: null,
    createdMessage2: null,
    createdMessage3: null,
    session2User1: null,
    accessTokenUser1Device2: '',
    refreshTokenUser1Device2: '',
    session3User1: null,
    accessTokenUser1Device3: '',
    refreshTokenUser1Device3: '',
    session4User1: null,
    accessTokenUser1Device4: '',
    refreshTokenUser1Device4: '',

    correctUserName1: '',
    correctUserSurName1: '',
    correctUserEmail1: '',
    correctUserPassword1: '',
    createdPost1User1: '',
    createdPost1User2: '',

    correctBlogNsme2: '',
    correctBlogDescription2: '',
    correctWebsiteUrl2: '',

    createdBlog2: null,
    createdBlog2Post1: null,
    correctTitleBlog2Post1: '',
    shortDescriptionBlog2Post1: '',
    contentBlog2Post1: '',
    blogIdBlog2Post1: '',
    createdBlog2Post1Comment1: null,
    createdBlog2Post1Comment2: null,
    createdBlog2Post1Comment3: null,
    createdBlog2Post1Comment4: null,
    createdBlog2Post2: null,
    correctTitleBlog2Post2: '',
    shortDescriptionBlog2Post2: '',
    contentBlog2Post2: '',
    blogIdBlog2Post2: '',
    createdBlog2Post2Comment1: null,
    createdBlog2Post2Comment2: null,
    createdBlog2Post2Comment3: null,
    createdBlog2Post2Comment4: null,
    createdBlog2Post3: null,
    correctTitleBlog2Post3: '',
    shortDescriptionBlog2Post3: '',
    contentBlog2Post3: '',
    blogIdBlog2Post3: '',
    createdBlog2Post3Comment1: null,
    createdBlog2Post3Comment2: null,
    createdBlog2Post3Comment3: null,
    createdBlog2Post3Comment4: null,
    createdBlog2Post4: null,
    correctTitleBlog2Post4: '',
    shortDescriptionBlog2Post4: '',
    contentBlog2Post4: '',
    blogIdBlog2Post4: '',
    createdBlog2Post4Comment1: null,
    createdBlog2Post4Comment2: null,
    createdBlog2Post4Comment3: null,
    createdBlog2Post4Comment4: null,

    createdUser2: null,
    accessTokenUser2Device1: '',
    refreshTokenUser2Device1: '',
    session1User2: null,
    correctUserName2: '',
    correctUserSurName2: '',
    correctUserEmail2: '',
    correctUserPassword2: '',

    correctBlogNsme3: '',
    correctBlogDescription3: '',
    correctWebsiteUrl3: '',

    createdBlog3: null,
    createdBlog3Post1: null,
    correctTitleBlog3Post1: '',
    shortDescriptionBlog3Post1: '',
    contentBlog3Post1: '',
    blogIdBlog3Post1: '',
    createdBlog3Post1Comment1: null,
    createdBlog3Post1Comment2: null,
    createdBlog3Post1Comment3: null,
    createdBlog3Post1Comment4: null,
    createdBlog3Post2: null,
    correctTitleBlog3Post2: '',
    shortDescriptionBlog3Post2: '',
    contentBlog3Post2: '',
    blogIdBlog3Post2: '',
    createdBlog3Post2Comment1: null,
    createdBlog3Post2Comment2: null,
    createdBlog3Post2Comment3: null,
    createdBlog3Post2Comment4: null,
    createdBlog3Post3: null,
    correctTitleBlog3Post3: '',
    shortDescriptionBlog3Post3: '',
    contentBlog3Post3: '',
    blogIdBlog3Post3: '',
    createdBlog3Post3Comment1: null,
    createdBlog3Post3Comment2: null,
    createdBlog3Post3Comment3: null,
    createdBlog3Post3Comment4: null,
    createdBlog3Post4: null,
    correctTitleBlog3Post4: '',
    shortDescriptionBlog3Post4: '',
    contentBlog3Post4: '',
    blogIdBlog3Post4: '',
    createdBlog3Post4Comment1: null,
    createdBlog3Post4Comment2: null,
    createdBlog3Post4Comment3: null,
    createdBlog3Post4Comment4: null,

    createdUser3: null,
    accessTokenUser3Device1: '',
    refreshTokenUser3Device1: '',
    session1User3: null,
    correctUserName3: '',
    correctUserSurName3: '',
    correctUserEmail3: '',
    correctUserPassword3: '',

    correctBlogNsme4: '',
    correctBlogDescription4: '',
    correctWebsiteUrl4: '',

    createdBlog4: null,
    createdBlog4Post1: null,
    correctTitleBlog4Post1: '',
    shortDescriptionBlog4Post1: '',
    contentBlog4Post1: '',
    blogIdBlog4Post1: '',
    createdBlog4Post1Comment1: null,
    createdBlog4Post1Comment2: null,
    createdBlog4Post1Comment3: null,
    createdBlog4Post1Comment4: null,
    createdBlog4Post2: null,
    correctTitleBlog4Post2: '',
    shortDescriptionBlog4Post2: '',
    contentBlog4Post2: '',
    blogIdBlog4Post2: '',
    createdBlog4Post2Comment1: null,
    createdBlog4Post2Comment2: null,
    createdBlog4Post2Comment3: null,
    createdBlog4Post2Comment4: null,
    createdBlog4Post3: null,
    correctTitleBlog4Post3: '',
    shortDescriptionBlog4Post3: '',
    contentBlog4Post3: '',
    blogIdBlog4Post3: '',
    createdBlog4Post3Comment1: null,
    createdBlog4Post3Comment2: null,
    createdBlog4Post3Comment3: null,
    createdBlog4Post3Comment4: null,
    createdBlog4Post4: null,
    correctTitleBlog4Post4: '',
    shortDescriptionBlog4Post4: '',
    contentBlog4Post4: '',
    blogIdBlog4Post4: '',
    createdBlog4Post4Comment1: null,
    createdBlog4Post4Comment2: null,
    createdBlog4Post4Comment3: null,
    createdBlog4Post4Comment4: null,

    createdUser4: null,
    accessTokenUser4Device1: '',
    refreshTokenUser4Device1: '',
    session1User4: null,
    correctUserName4: '',
    correctUserSurName4: '',
    correctUserEmail4: '',
    correctUserPassword4: '',
}

