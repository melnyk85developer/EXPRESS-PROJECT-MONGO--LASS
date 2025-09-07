

export const resetPasswordEmailMessageHTMLDocument = (nameProjekt: string, to: string, text: any, link: string, user: any) => {
    return (`
    <section style="
        margin: 0;
        padding: 5px;
        background-color: #282828;
        border: 1px solid black;
        text-decoration: none !important;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    ">

        <div 
            style="
                padding: 20px;
                border: 1px solid black;
                border-radius: 8px;
                background-color: #282828;
                text-align: center;
            "
        >

        <h1 
            style="
                text-align: center;
                margin-bottom: 20px;
                font-weight: normal;
                color: wheat;
            "
        >
            Сбросс пароля на ${nameProjekt}
        </h1>
            <p 
                style="
                    font-size: 18px;
                    font-weight: 400;
                    text-align: left;
                    color: wheat;
                    margin-bottom: 20px;
                "
            >
                Вы получили это сообщение по тому, что Ваш электронный адресс ${to} только что был указан при заказе услуги сбросить пароль 
                в аккаунте пользователя <strong style="color: #ff6600; font-style: italic; font-size: 18px; font-family: 'Roboto';"> ${user.name} ${user.surname}</strong> проекта ${nameProjekt}
            </p>
            <p                
                style="
                    font-size: 17px;
                    text-align: left;
                    color: wheat;
            ">
                <strong 
                    style="
                        margin-left: 20px;
                        margin-bottom: 18px;
                        color: #ff6600;
                        font-weight: normal;
                        font-style: italic;
                ">
                Если Вы не заказывали услугу сброса пароля, то это может означать: 
                </strong><br/>
            </p                 
                style="
                    font-size: 0.875rem;
                    text-align: left;
                    color: wheat;

            ">
            <p                
                style="
                    font-size: 0.875rem;
                    text-align: left;
                    color: #e2e2e2;
                ">
                <strong 
                    style="
                        margin-left: 40px;
                        margin-bottom: 20px;
                        color: wheat;
                        font-weight: normal;
                ">
                    1. Либо кто то по ошибке ввел Ваш E-Mail 
                    <span 
                        style="
                            text-decoration: none;
                            font-size: 0.875rem;;
                            color: #ff6600;
                    ">${to}</span> при сброссе пароля для своего аккаунта. (что вряд-ли...)</strong><br/>
            </p>
            <p                
                style="
                    font-size: 0.875rem;
                    text-align: left;
                    color: wheat;
            ">
                <strong 
                    style="
                        margin-left: 40px;
                        margin-bottom: 20px;
                        color: wheat;
                        font-weight: normal;
                ">
                    2. Либо злоумышленники пытаются получить доступ к Вашему аккаунту с помощью Вашей электронной почты: 
                    <span 
                        style="
                            text-decoration: none;
                            font-size: 0.875rem;;
                            color: #ff6600;
                    ">${to}</span>. 
                    
                </strong><br/>
            </p>
            <p                
                style="
                    font-size: 17px;
                    text-align: left;
                    color: wheat;
            ">
                <strong 
                    style="
                        margin-left: 20px;
                        margin-bottom: 20px;
                        color: #ff6600;
                        font-weight: normal;
                        font-style: italic;
                ">  
                (В случае если это не Вы совершаете сбросс пароля, то настоятельно рекомендуем временно заблокировать эту услугу 
                с помощью Вашего E-Mail до выяснения!)
                </strong><br/>
            </p>
            <div                    
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                    font-weight: normal;
            ">
                <p
                    style="font-size: 0.875rem;color: wheat;"
                >Я не совершаю сбросс пароля на проекте ${nameProjekt}, прошу временно заблокировать сброс пароля с помощью моего E-Mail
                </p >
                <button
                    style="
                        width: 220px;
                        margin: auto 10px;
                        padding: 4px 10px;
                        color: wheat;
                        background-color: #282828;
                        font-weight: normal;

                ">Заблокировать сбросс пароля</button>
            </div>
            <div                    
                style="
                    display: flex;
                    justify-content: space-between;
                    color: #FFAC00;
                    font-weight: normal;
            ">
                <p 
                    style="font-size: 0.875rem;color: wheat; padding-bottom: 2px;"
                >Это я совершаю сбросс пароля на проекте ${nameProjekt}, по этому:
                </p>
                    <button
                        style="
                            width: 220px;
                            margin: auto 10px;
                            padding: 4px 10px;
                            background-color: #282828;
                            font-weight: normal;
                    ">
                        <a 
                            href="${link}" 
                            target="_blank"
                            style="
                                color: wheat;
                                text-decoration: none;
                            "
                        >Подтверждаю сбросс пароля</a>
                    </button>
                <!-- <p 
                    style="font-size: 0.875rem;color: wheat; padding-bottom: 2px;"
                >Код активации: <span style="color: #ff6600;">${' '}${text}</span>
                </p> -->
            </div>
        </div>
    </section> 
    `)
}