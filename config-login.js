{
    "cron": "0/2 *  * * *",
    "devices" : [
        "IphoneX"
    ],
    "networks" : [
        "WIFI"
    ],
    "urls": [
        {
            "url": "https://www.yahoo.com",
            "plugins": [
                {
                    "name": "lighthouse",
                    "report": true
                }
            ]
        },
        {
            "url": "https://www.facebook.com",
            "plugins": [
                {
                    "name": "lighthouse",
                    "report": true
                }
            ]
        }
    ]
}
